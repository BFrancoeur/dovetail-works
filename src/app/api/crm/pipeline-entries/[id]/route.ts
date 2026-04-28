import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const { currentStage, exitReason, notes } = body

    if (!currentStage) {
      return NextResponse.json({ error: 'currentStage is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Read existing entry to build history append
    const existing = await payload.findByID({
      collection: 'pipeline-entries',
      id,
      depth: 0,
      overrideAccess: false,
      user,
    })

    const now = new Date().toISOString()
    const prevStage = existing.currentStage as string
    const prevEntered = existing.enteredCurrentStageAt as string | null

    const historyEntry = {
      pipeline:   existing.pipeline,
      stage:      prevStage,
      enteredAt:  prevEntered ?? now,
      exitedAt:   now,
      movedBy:    'manual',
      exitReason: exitReason ?? null,
      notes:      notes ?? null,
    }

    const existingHistory = Array.isArray(existing.stageHistory)
      ? existing.stageHistory
      : []

    const updated = await payload.update({
      collection: 'pipeline-entries',
      id,
      data: {
        currentStage,
        enteredCurrentStageAt: now,
        movedBy:               'manual',
        exitReason:            exitReason ?? null,
        stageHistory:          [...existingHistory, historyEntry],
      },
      overrideAccess: false,
      user,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[pipeline-entries PATCH]', err)
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 })
  }
}
