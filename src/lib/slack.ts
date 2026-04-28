import crypto from 'crypto'

// ── Agent identities ──────────────────────────────────────────────────────────

export const AGENTS = {
  pipeline:   { name: 'DW Pipeline',   emoji: ':arrows_counterclockwise:' },
  scout:      { name: 'DW Scout',      emoji: ':mag:' },
  copywriter: { name: 'DW Copywriter', emoji: ':pencil:' },
  analyst:    { name: 'DW Analyst',    emoji: ':bar_chart:' },
  reporter:   { name: 'DW Reporter',   emoji: ':page_facing_up:' },
} as const

export type AgentKey = keyof typeof AGENTS

// ── Simple notification ───────────────────────────────────────────────────────

export async function sendNotification(
  agent: AgentKey,
  text: string,
): Promise<void> {
  const { name, emoji } = AGENTS[agent]
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('[Slack] SLACK_WEBHOOK_URL not set — skipping notification')
    return
  }

  await fetch(webhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ username: name, icon_emoji: emoji, text }),
  })
}

// ── Approval request (Approve / Reject buttons) ───────────────────────────────

export async function sendApprovalRequest({
  agent,
  activityId,
  contactName,
  proposedAction,
}: {
  agent:          AgentKey
  activityId:     string
  contactName:    string
  proposedAction: string
}): Promise<string | null> {
  const { name, emoji } = AGENTS[agent]
  const botToken = process.env.SLACK_BOT_TOKEN
  const channel  = process.env.SLACK_NOTIFICATION_CHANNEL ?? '#crm-notifications'

  if (!botToken) {
    console.warn('[Slack] SLACK_BOT_TOKEN not set — skipping approval request')
    return null
  }

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${botToken}`,
    },
    body: JSON.stringify({
      channel,
      username:   name,
      icon_emoji: emoji,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${name}* wants to take an action on *${contactName}*:\n\n>${proposedAction}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type:      'button',
              text:      { type: 'plain_text', text: 'Approve' },
              style:     'primary',
              action_id: 'agent_approve',
              value:     activityId,
            },
            {
              type:      'button',
              text:      { type: 'plain_text', text: 'Reject' },
              style:     'danger',
              action_id: 'agent_reject',
              value:     activityId,
            },
          ],
        },
      ],
    }),
  })

  const data = await res.json() as { ok: boolean; ts?: string; error?: string }
  if (!data.ok) {
    console.error('[Slack] chat.postMessage failed:', data.error)
    return null
  }

  return data.ts ?? null // message timestamp — used to update the message after decision
}

// ── Update message after decision ─────────────────────────────────────────────

export async function updateApprovalMessage({
  messageTs,
  agent,
  contactName,
  proposedAction,
  decision,
}: {
  messageTs:      string
  agent:          AgentKey
  contactName:    string
  proposedAction: string
  decision:       'approved' | 'rejected'
}): Promise<void> {
  const { name, emoji } = AGENTS[agent]
  const botToken = process.env.SLACK_BOT_TOKEN
  const channel  = process.env.SLACK_NOTIFICATION_CHANNEL ?? '#crm-notifications'

  if (!botToken) return

  const icon   = decision === 'approved' ? '✅' : '❌'
  const label  = decision === 'approved' ? 'Approved'  : 'Rejected'

  await fetch('https://slack.com/api/chat.update', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${botToken}`,
    },
    body: JSON.stringify({
      channel,
      ts: messageTs,
      username:   name,
      icon_emoji: emoji,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${icon} *${label}* — ${name} action on *${contactName}*:\n\n>${proposedAction}`,
          },
        },
      ],
    }),
  })
}

// ── Signature verification ────────────────────────────────────────────────────

export function verifySlackSignature(
  rawBody:   string,
  timestamp: string,
  signature: string,
): boolean {
  const secret = process.env.SLACK_SIGNING_SECRET
  if (!secret) return false

  // Reject requests older than 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false

  const base = `v0:${timestamp}:${rawBody}`
  const expected = 'v0=' + crypto
    .createHmac('sha256', secret)
    .update(base)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature),
  )
}
