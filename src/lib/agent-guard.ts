import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendNotification } from '@/lib/slack'
import type { AgentKey } from '@/lib/slack'

// ── Kill switch ───────────────────────────────────────────────────────────────

const LOCK_FILE = path.join(process.cwd(), '.agent-lock')

export function isKillSwitchActive(): boolean {
  // Env var check — disables agents at startup without needing a lock file
  if (process.env.AGENTS_ENABLED === 'false') return true
  try {
    return fs.existsSync(LOCK_FILE)
  } catch {
    return true // fail safe — if we can't check, assume locked
  }
}

export function activateKillSwitch(reason: string): void {
  try {
    fs.writeFileSync(LOCK_FILE, JSON.stringify({
      activatedAt: new Date().toISOString(),
      reason,
    }))
  } catch (err) {
    console.error('[agent-guard] Failed to write lock file:', err)
  }
}

export function deactivateKillSwitch(): void {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE)
  } catch (err) {
    console.error('[agent-guard] Failed to remove lock file:', err)
  }
}

export function killSwitchStatus(): { active: boolean; reason?: string; activatedAt?: string } {
  if (!fs.existsSync(LOCK_FILE)) return { active: false }
  try {
    const data = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'))
    return { active: true, ...data }
  } catch {
    return { active: true }
  }
}

// ── Emergency alert ───────────────────────────────────────────────────────────

async function emergencyAlert(agent: AgentKey, activityId: string, reason: string): Promise<void> {
  const message =
    `🚨 *EMERGENCY — Agent Kill Switch Triggered*\n` +
    `Agent: *${agent}* | Activity ID: \`${activityId}\`\n` +
    `Reason: ${reason}\n\n` +
    `All agent actions are now blocked.\n` +
    `To restore after investigation: \`./scripts/agent-restore.sh\``

  try {
    await sendNotification('pipeline', message)
  } catch (err) {
    console.error('[agent-guard] Failed to send emergency Slack alert:', err)
  }
}

// ── Guarded agent action ──────────────────────────────────────────────────────
// The ONLY way an agent can write data. Enforces:
//   1. Kill switch is not active
//   2. An approved activity record exists for this action
//   3. Auto-triggers kill switch + emergency alert on any violation

export async function guardedAgentAction<T>({
  agent,
  activityId,
  execute,
}: {
  agent:      AgentKey
  activityId: string
  execute:    () => Promise<T>
}): Promise<T> {

  // ── 1. Kill switch check ───────────────────────────────────────────────────
  if (isKillSwitchActive()) {
    throw new Error(
      `[agent-guard] Kill switch is active — all agent actions are blocked. ` +
      `Run ./scripts/agent-restore.sh after investigation.`
    )
  }

  // ── 2. Verify Slack approval ───────────────────────────────────────────────
  const payload = await getPayload({ config })

  let activity: Record<string, unknown>
  try {
    activity = await payload.findByID({
      collection: 'activities',
      id:         activityId,
      depth:      0,
    }) as Record<string, unknown>
  } catch {
    const reason = `Agent attempted action with invalid activity ID: ${activityId}`
    activateKillSwitch(reason)
    await emergencyAlert(agent, activityId, reason)
    throw new Error(`[agent-guard] ${reason}`)
  }

  const agentAction    = activity.agentAction as Record<string, unknown> | undefined
  const approvalStatus = agentAction?.approvalStatus

  if (approvalStatus !== 'approved') {
    const reason =
      `Unauthorized write/delete attempt without Slack approval ` +
      `(status: ${approvalStatus ?? 'missing'})`
    activateKillSwitch(reason)
    await emergencyAlert(agent, activityId, reason)
    throw new Error(`[agent-guard] ${reason}`)
  }

  // ── 3. Execute the approved action ────────────────────────────────────────
  const result = await execute()

  // Mark as executed
  await payload.update({
    collection: 'activities',
    id:         activityId,
    data: {
      agentAction: {
        ...agentAction,
        approvalStatus: 'executed',
        executedAt:     new Date().toISOString(),
      },
    },
  })

  return result
}
