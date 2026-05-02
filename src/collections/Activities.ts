import type { CollectionConfig } from 'payload'
import { tenantReadAccess, tenantWriteAccess, agentOrTeamWriteAccess } from '../lib/access.ts'

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['type', 'contact', 'subject', 'occurredAt', 'tenant'],
    description: 'Immutable log of every interaction with a contact — calls, emails, notes, meetings, and agent actions.',
    group: 'CRM',
  },
  access: {
    create: agentOrTeamWriteAccess, // agents can log proposals
    read:   tenantReadAccess,
    update: tenantWriteAccess,      // only humans can update (approval decisions)
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
    {
      name: 'pipelineEntry',
      type: 'relationship',
      relationTo: 'pipeline-entries',
      label: 'Pipeline Entry',
      admin: {
        position: 'sidebar',
        description: 'Which pipeline stage this activity occurred in.',
      },
    },

    // ── Activity type ──────────────────────────────────────────────────────────
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Call',         value: 'call' },
        { label: 'Email',        value: 'email' },
        { label: 'Note',         value: 'note' },
        { label: 'Meeting',      value: 'meeting' },
        { label: 'Agent Action', value: 'agent-action' },
      ],
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Direction',
      options: [
        { label: 'Outbound', value: 'outbound' },
        { label: 'Inbound',  value: 'inbound' },
      ],
      admin: {
        condition: (data) => ['call', 'email'].includes(data?.type),
        description: 'Did you initiate this, or did the contact?',
      },
    },

    // ── Content ────────────────────────────────────────────────────────────────
    {
      name: 'subject',
      type: 'text',
      label: 'Subject / Title',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Notes / Content',
    },
    {
      name: 'outcome',
      type: 'text',
      label: 'Outcome',
      admin: {
        description: 'Result of the interaction — e.g. "Left voicemail", "Scheduled follow-up", "Objection: price".',
      },
    },

    // ── Timing ────────────────────────────────────────────────────────────────
    {
      name: 'occurredAt',
      type: 'date',
      label: 'Date & Time',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration (minutes)',
      admin: {
        condition: (data) => ['call', 'meeting'].includes(data?.type),
        position: 'sidebar',
      },
    },

    // ── Agent action fields ────────────────────────────────────────────────────
    {
      name: 'agentAction',
      type: 'group',
      label: 'Agent Action Detail',
      admin: {
        condition: (data) => data?.type === 'agent-action',
        description: 'Populated automatically when an agent logs an action.',
      },
      fields: [
        {
          name: 'agentId',
          type: 'text',
          label: 'Agent ID',
        },
        {
          name: 'proposedAction',
          type: 'textarea',
          label: 'Proposed Action',
        },
        {
          name: 'approvalStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending Approval', value: 'pending' },
            { label: 'Approved',         value: 'approved' },
            { label: 'Rejected',         value: 'rejected' },
            { label: 'Executed',         value: 'executed' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'approvedAt',
              type: 'date',
              label: 'Approved At',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'executedAt',
              type: 'date',
              label: 'Executed At',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          name: 'slackMessageId',
          type: 'text',
          label: 'Slack Message ID',
          admin: {
            description: 'Used to update the approval message after a decision is made.',
            readOnly: true,
          },
        },
      ],
    },
  ],
}
