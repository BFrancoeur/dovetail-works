import type { CollectionConfig } from 'payload'
import { tenantReadAccess, tenantWriteAccess } from '@/lib/access'
import { ALL_STAGES, EXIT_REASONS } from '@/lib/pipelines'

export const PipelineEntries: CollectionConfig = {
  slug: 'pipeline-entries',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['contact', 'pipeline', 'currentStage', 'movedBy', 'updatedAt'],
    description: 'Tracks which pipeline and stage each contact is currently in.',
    group: 'CRM',
  },
  access: {
    create: tenantWriteAccess,
    read:   tenantReadAccess,
    update: tenantWriteAccess,
    delete: tenantWriteAccess,
  },
  fields: [
    // ── Tenant & contact ───────────────────────────────────────────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'contact',
      type: 'relationship',
      relationTo: 'contacts',
      required: true,
      admin: { position: 'sidebar' },
    },

    // ── Current position ───────────────────────────────────────────────────────
    {
      name: 'pipeline',
      type: 'select',
      required: true,
      options: [
        { label: 'Primary Pipeline',       value: 'primary' },
        { label: 'Active Deal Pipeline',   value: 'active-deal' },
        { label: 'Lead Nurturing Pipeline', value: 'lead-nurturing' },
      ],
    },
    {
      name: 'currentStage',
      type: 'select',
      required: true,
      options: ALL_STAGES,
      admin: {
        description: 'Options are prefixed with their pipeline name for clarity.',
      },
    },
    {
      name: 'enteredCurrentStageAt',
      type: 'date',
      label: 'Entered Current Stage',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },

    // ── Movement metadata ──────────────────────────────────────────────────────
    {
      name: 'movedBy',
      type: 'select',
      label: 'Last Moved By',
      defaultValue: 'system',
      options: [
        { label: 'Manual (you)',  value: 'manual' },
        { label: 'Agent',        value: 'agent' },
        { label: 'Webhook',      value: 'webhook' },
        { label: 'System',       value: 'system' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'exitReason',
      type: 'select',
      label: 'Exit Reason',
      options: EXIT_REASONS as unknown as { label: string; value: string }[],
      admin: {
        position: 'sidebar',
        description: 'Why the contact left their previous stage.',
      },
    },

    // ── Stage history ──────────────────────────────────────────────────────────
    {
      name: 'stageHistory',
      type: 'array',
      label: 'Stage History',
      admin: {
        description: 'Full audit trail of every stage this contact has passed through.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'pipeline',
          type: 'select',
          options: [
            { label: 'Primary',       value: 'primary' },
            { label: 'Active Deal',   value: 'active-deal' },
            { label: 'Lead Nurturing', value: 'lead-nurturing' },
          ],
        },
        {
          name: 'stage',
          type: 'text',
          label: 'Stage',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enteredAt',
              type: 'date',
              label: 'Entered',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'exitedAt',
              type: 'date',
              label: 'Exited',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          name: 'movedBy',
          type: 'select',
          options: [
            { label: 'Manual',   value: 'manual' },
            { label: 'Agent',    value: 'agent' },
            { label: 'Webhook',  value: 'webhook' },
            { label: 'System',   value: 'system' },
          ],
        },
        {
          name: 'exitReason',
          type: 'select',
          options: EXIT_REASONS as unknown as { label: string; value: string }[],
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notes',
        },
      ],
    },
  ],
}
