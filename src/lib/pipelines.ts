// Canonical pipeline and stage definitions.
// Used by PipelineEntries collection, Kanban board, and agent logic.

export const PIPELINES = {
  primary: {
    label: 'Primary Pipeline',
    stages: [
      { value: 'visitor',        label: 'Visitor' },
      { value: 'form-started',   label: 'Form Started' },
      { value: 'form-submitted', label: 'Form Submitted' },
      { value: 'results-viewed', label: 'Results Viewed' },
      { value: 'call-booked',    label: 'Call Booked' },
      { value: 'call-attended',  label: 'Call Attended' },
      { value: 'deal-closed',    label: 'Deal Closed' },
    ],
  },
  'active-deal': {
    label: 'Active Deal Pipeline',
    stages: [
      { value: 'nurture-sequence-active',     label: 'Nurture Sequence Active' },
      { value: 'reply-window-open',           label: 'Reply Window Open' },
      { value: 'objection-email-sent',        label: 'Objection-Handle Email Sent' },
      { value: 'second-call-booked',          label: 'Second Call Booked' },
      { value: 'second-call-attended',        label: 'Second Call Attended' },
      { value: 'closed-won',                  label: 'Closed Won' },
      { value: 'lost',                        label: 'Lost' },
    ],
  },
  'lead-nurturing': {
    label: 'Lead Nurturing Pipeline',
    stages: [
      { value: 'sequence-active',   label: 'Sequence Active' },
      { value: 'sequence-complete', label: 'Sequence Complete' },
      { value: 're-engaged',        label: 'Re-engaged' },
      { value: 'lost',              label: 'Lost' },
      { value: 'dormant',           label: 'Dormant' },
      { value: 'warm-up-sent',      label: 'Warm-up Sent' },
      { value: 'permanently-lost',  label: 'Permanently Lost' },
    ],
  },
} as const

export type PipelineKey = keyof typeof PIPELINES

export type StageValue<P extends PipelineKey> =
  (typeof PIPELINES)[P]['stages'][number]['value']

// Flat list of all stages — used for select options in Payload
// Deduplicated by value since 'lost' appears in multiple pipelines
const _allStages = Object.entries(PIPELINES).flatMap(([, def]) =>
  def.stages.map((s) => ({
    label: s.label,
    value: s.value,
  })),
)
export const ALL_STAGES = _allStages.filter(
  (s, i) => _allStages.findIndex((x) => x.value === s.value) === i,
)

// Exit reasons — why a contact left a pipeline stage
export const EXIT_REASONS = [
  { value: 'A',           label: 'A — Abandoned before form' },
  { value: 'B',           label: 'B — Form submitted, results not viewed' },
  { value: 'C',           label: 'C — Results viewed, no booking' },
  { value: 'D',           label: 'D — No-show' },
  { value: 'E',           label: 'E — Attended, moved to Active Deal' },
  { value: 'F-hung-up',   label: 'F — Hung up (Lost)' },
  { value: 'F-no-close',  label: 'F — Stayed on call, no close' },
  { value: 'rebooked',    label: 'Re-booked a call' },
  { value: 'won',         label: 'Deal closed (Won)' },
  { value: 'lost',        label: 'Deal lost' },
  { value: 'manual',      label: 'Manually moved' },
  { value: 'agent',       label: 'Moved by agent' },
  { value: 'other',       label: 'Other' },
] as const
