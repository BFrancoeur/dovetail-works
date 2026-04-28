'use client'

import { useState, useCallback } from 'react'
import type { KanbanPipeline } from '@/types/crm'
import { KanbanColumn } from './KanbanColumn'
import styles from './KanbanBoard.module.css'

type Props = {
  initial: KanbanPipeline
}

export function KanbanBoard({ initial }: Props) {
  const [pipeline, setPipeline] = useState<KanbanPipeline>(initial)
  const [draggingEntryId, setDraggingEntryId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDragStart = useCallback((entryId: string) => {
    setDraggingEntryId(entryId)
  }, [])

  const handleDrop = useCallback(async (targetStage: string) => {
    if (!draggingEntryId) return

    // Find the contact being moved
    let sourceStage: string | null = null
    for (const stage of pipeline.stages) {
      if (stage.contacts.some((c) => c.entryId === draggingEntryId)) {
        sourceStage = stage.value
        break
      }
    }
    if (!sourceStage || sourceStage === targetStage) {
      setDraggingEntryId(null)
      return
    }

    // Optimistic update
    setPipeline((prev) => {
      const stages = prev.stages.map((stage) => {
        if (stage.value === sourceStage) {
          return { ...stage, contacts: stage.contacts.filter((c) => c.entryId !== draggingEntryId) }
        }
        if (stage.value === targetStage) {
          const moving = prev.stages
            .flatMap((s) => s.contacts)
            .find((c) => c.entryId === draggingEntryId)
          if (!moving) return stage
          return {
            ...stage,
            contacts: [...stage.contacts, { ...moving, currentStage: targetStage }],
          }
        }
        return stage
      })
      return { ...prev, stages }
    })

    setDraggingEntryId(null)
    setError(null)

    try {
      const res = await fetch(`/api/crm/pipeline-entries/${draggingEntryId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentStage: targetStage, movedBy: 'manual' }),
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch {
      setError('Failed to save stage change — please refresh.')
      // Revert by re-fetching
      const res = await fetch(`/api/crm/pipeline?pipeline=${pipeline.key}`)
      if (res.ok) setPipeline(await res.json())
    }
  }, [draggingEntryId, pipeline])

  return (
    <div className={styles.board}>
      {error && <div className={styles.errorBanner}>{error}</div>}
      <div className={styles.columns}>
        {pipeline.stages.map((stage) => (
          <KanbanColumn
            key={stage.value}
            stage={stage}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  )
}
