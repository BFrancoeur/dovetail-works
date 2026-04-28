'use client'

import type { KanbanContact, KanbanStage } from '@/types/crm'
import { KanbanCard } from './KanbanCard'
import styles from './KanbanBoard.module.css'

type Props = {
  stage: KanbanStage
  onDragStart: (entryId: string) => void
  onDrop: (stageValue: string) => void
}

export function KanbanColumn({ stage, onDragStart, onDrop }: Props) {
  return (
    <div
      className={styles.column}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(stage.value)}
    >
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{stage.label}</span>
        <span className={styles.columnCount}>{stage.contacts.length}</span>
      </div>

      <div className={styles.cardList}>
        {stage.contacts.map((contact: KanbanContact) => (
          <KanbanCard
            key={contact.entryId}
            contact={contact}
            onDragStart={onDragStart}
          />
        ))}
        {stage.contacts.length === 0 && (
          <div className={styles.emptyColumn}>No contacts</div>
        )}
      </div>
    </div>
  )
}
