export type KanbanContact = {
  id: string
  entryId: string
  firstName: string
  lastName: string
  email: string
  companyName?: string
  currentStage: string
  enteredCurrentStageAt: string | null
  movedBy: string
}

export type KanbanStage = {
  value: string
  label: string
  contacts: KanbanContact[]
}

export type KanbanPipeline = {
  key: string
  label: string
  stages: KanbanStage[]
}

export type MetricSnapshot = {
  label: string
  today: number | string
  week: number | string
  month: number | string
  format?: 'number' | 'percent'
}
