import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PIPELINES } from '@/lib/pipelines'

export const dynamic = 'force-dynamic'
import { KanbanBoard } from '@/components/organisms/KanbanBoard/KanbanBoard'
import { MetricsBand } from '@/components/organisms/MetricsBand/MetricsBand'
import type { KanbanPipeline, MetricSnapshot } from '@/types/crm'
import styles from './pipeline.module.css'

type Props = { params: Promise<{ pipeline: string }> }

// Placeholder metrics — wired to real data in a later step
const PLACEHOLDER_METRICS: MetricSnapshot[] = [
  { label: 'New Leads',       today: '--', week: '--', month: '--', format: 'number' },
  { label: 'Emails Sent',     today: '--', week: '--', month: '--', format: 'number' },
  { label: 'Email Opens',     today: '--', week: '--', month: '--', format: 'number' },
  { label: 'Email CTR',       today: '--', week: '--', month: '--', format: 'percent' },
  { label: 'Call Show Rate',  today: '--', week: '--', month: '--', format: 'percent' },
  { label: 'Close Rate',      today: '--', week: '--', month: '--', format: 'percent' },
  { label: 'Deals Won',       today: '--', week: '--', month: '--', format: 'number' },
  { label: 'Deals Lost',      today: '--', week: '--', month: '--', format: 'number' },
]

export default async function PipelinePage({ params }: Props) {
  const { pipeline: pipelineKey } = await params

  if (!PIPELINES[pipelineKey as keyof typeof PIPELINES]) notFound()

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin/login')

  const pipelineDef = PIPELINES[pipelineKey as keyof typeof PIPELINES]

  // Fetch pipeline entries grouped by stage
  const entries = await payload.find({
    collection: 'pipeline-entries',
    where: { pipeline: { equals: pipelineKey } },
    depth: 2,
    limit: 500,
    overrideAccess: false,
    user,
  })

  const grouped: Record<string, typeof entries.docs> = {}
  for (const entry of entries.docs) {
    const stage = entry.currentStage as string
    if (!grouped[stage]) grouped[stage] = []
    grouped[stage].push(entry)
  }

  const initial: KanbanPipeline = {
    key:   pipelineKey,
    label: pipelineDef.label,
    stages: pipelineDef.stages.map((s) => ({
      value: s.value,
      label: s.label,
      contacts: (grouped[s.value] ?? []).map((entry) => {
        const contact = entry.contact as Record<string, unknown>
        return {
          id:                    String(contact?.id ?? ''),
          entryId:               String(entry.id),
          firstName:             String(contact?.firstName ?? ''),
          lastName:              String(contact?.lastName  ?? ''),
          email:                 String(contact?.email     ?? ''),
          companyName:           contact?.companyName ? String(contact.companyName) : undefined,
          currentStage:          s.value,
          enteredCurrentStageAt: entry.enteredCurrentStageAt as string | null,
          movedBy:               String(entry.movedBy ?? 'system'),
        }
      }),
    })),
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{pipelineDef.label}</h1>
      <MetricsBand metrics={PLACEHOLDER_METRICS} />
      <KanbanBoard initial={initial} />
    </div>
  )
}
