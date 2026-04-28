import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PIPELINES } from '@/lib/pipelines'
import type { KanbanPipeline, KanbanContact } from '@/types/crm'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pipelineKey = searchParams.get('pipeline') ?? 'primary'

    const pipelineDef = PIPELINES[pipelineKey as keyof typeof PIPELINES]
    if (!pipelineDef) {
      return NextResponse.json({ error: 'Unknown pipeline' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entries = await payload.find({
      collection: 'pipeline-entries',
      where: { pipeline: { equals: pipelineKey } },
      depth: 2,
      limit: 500,
      overrideAccess: false,
      user,
    })

    // Group contacts by currentStage
    const grouped: Record<string, KanbanContact[]> = {}
    for (const entry of entries.docs) {
      const contact = entry.contact as Record<string, unknown>
      if (!contact || typeof contact !== 'object') continue

      const stage = entry.currentStage as string
      if (!grouped[stage]) grouped[stage] = []

      grouped[stage].push({
        id:                     String(contact.id ?? ''),
        entryId:                String(entry.id),
        firstName:              String(contact.firstName ?? ''),
        lastName:               String(contact.lastName  ?? ''),
        email:                  String(contact.email     ?? ''),
        companyName:            contact.companyName ? String(contact.companyName) : undefined,
        currentStage:           stage,
        enteredCurrentStageAt:  entry.enteredCurrentStageAt as string | null,
        movedBy:                String(entry.movedBy ?? 'system'),
      })
    }

    const pipeline: KanbanPipeline = {
      key:    pipelineKey,
      label:  pipelineDef.label,
      stages: pipelineDef.stages.map((s) => ({
        value:    s.value,
        label:    s.label,
        contacts: grouped[s.value] ?? [],
      })),
    }

    return NextResponse.json(pipeline)
  } catch (err) {
    console.error('[crm/pipeline]', err)
    return NextResponse.json({ error: 'Failed to load pipeline' }, { status: 500 })
  }
}
