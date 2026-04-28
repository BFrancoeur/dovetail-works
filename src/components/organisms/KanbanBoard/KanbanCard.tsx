'use client'

import type { KanbanContact } from '@/types/crm'
import styles from './KanbanBoard.module.css'

type Props = {
  contact: KanbanContact
  onDragStart: (entryId: string) => void
}

function timeInStage(entered: string | null): string {
  if (!entered) return ''
  const ms = Date.now() - new Date(entered).getTime()
  const days = Math.floor(ms / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

export function KanbanCard({ contact, onDragStart }: Props) {
  const name = [contact.firstName, contact.lastName].filter(Boolean).join(' ')

  return (
    <div
      className={styles.card}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(contact.entryId)
      }}
    >
      <p className={styles.cardName}>{name || contact.email}</p>
      {contact.companyName && (
        <p className={styles.cardCompany}>{contact.companyName}</p>
      )}
      <p className={styles.cardEmail}>{contact.email}</p>
      {contact.enteredCurrentStageAt && (
        <p className={styles.cardAge}>{timeInStage(contact.enteredCurrentStageAt)}</p>
      )}
    </div>
  )
}
