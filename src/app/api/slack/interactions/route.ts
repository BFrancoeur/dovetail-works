import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifySlackSignature, updateApprovalMessage } from '@/lib/slack'
import type { AgentKey } from '@/lib/slack'

export async function POST(req: NextRequest) {
  const rawBody  = await req.text()
  const timestamp = req.headers.get('x-slack-request-timestamp') ?? ''
  const signature = req.headers.get('x-slack-signature') ?? ''

  if (!verifySlackSignature(rawBody, timestamp, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Slack sends interactions as URL-encoded form with a "payload" field
  const params  = new URLSearchParams(rawBody)
  const payload = JSON.parse(params.get('payload') ?? '{}') as {
    type:    string
    actions: Array<{ action_id: string; value: string }>
    message: { ts: string; blocks: unknown[] }
  }

  if (payload.type !== 'block_actions') {
    return NextResponse.json({ ok: true })
  }

  const action     = payload.actions[0]
  const activityId = action?.value
  const decision   = action?.action_id === 'agent_approve' ? 'approved' : 'rejected'
  const messageTs  = payload.message?.ts

  if (!activityId) {
    return NextResponse.json({ error: 'Missing activity ID' }, { status: 400 })
  }

  try {
    const db = await getPayload({ config })

    // Fetch the activity to get agent + contact info for the message update
    const activity = await db.findByID({
      collection: 'activities',
      id:         activityId,
      depth:      1,
    })

    const agentAction    = activity.agentAction as Record<string, unknown>
    const contact        = activity.contact    as Record<string, unknown>
    const proposedAction = String(agentAction?.proposedAction ?? '')
    const agentId        = String(agentAction?.agentId ?? 'pipeline') as AgentKey
    const contactName    = [contact?.firstName, contact?.lastName]
      .filter(Boolean)
      .join(' ') || String(contact?.email ?? 'Unknown')

    const now = new Date().toISOString()

    // Update the activity record with the decision
    await db.update({
      collection: 'activities',
      id:         activityId,
      data: {
        agentAction: {
          ...agentAction,
          approvalStatus: decision,
          approvedAt:     now,
          ...(decision === 'approved' ? { executedAt: now } : {}),
        },
      },
    })

    // Update the Slack message to reflect the decision
    if (messageTs) {
      await updateApprovalMessage({
        messageTs,
        agent:          agentId,
        contactName,
        proposedAction,
        decision,
      })
    }

    // Respond immediately — Slack requires a response within 3 seconds
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[slack/interactions]', err)
    return NextResponse.json({ error: 'Failed to process interaction' }, { status: 500 })
  }
}
