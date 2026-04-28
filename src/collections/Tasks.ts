import type { CollectionConfig } from 'payload'
import { tenantReadAccess, tenantWriteAccess } from '@/lib/access'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'priority', 'dueDate', 'contact'],
    description: 'Actionable to-dos attached to contacts. Due dates trigger SMS reminders via Twilio.',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'pipelineEntry',
      type: 'relationship',
      relationTo: 'pipeline-entries',
      label: 'Pipeline Entry',
      admin: { position: 'sidebar' },
    },

    // ── Task details ───────────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'follow-up',
      options: [
        { label: 'Call',       value: 'call' },
        { label: 'Email',      value: 'email' },
        { label: 'Follow-up',  value: 'follow-up' },
        { label: 'Meeting',    value: 'meeting' },
        { label: 'Other',      value: 'other' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },

    // ── Priority & status ──────────────────────────────────────────────────────
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low',    value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High',   value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending',     value: 'pending' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed',   value: 'completed' },
        { label: 'Cancelled',   value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Completed At',
      admin: {
        condition: (data) => data?.status === 'completed',
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },

    // ── Scheduling ─────────────────────────────────────────────────────────────
    {
      name: 'dueDate',
      type: 'date',
      label: 'Due Date & Time',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },

    // ── SMS reminder ───────────────────────────────────────────────────────────
    {
      name: 'reminder',
      type: 'group',
      label: 'SMS Reminder',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Send SMS reminder',
        },
        {
          name: 'reminderAt',
          type: 'date',
          label: 'Remind me at',
          admin: {
            condition: (data) => data?.reminder?.enabled,
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Defaults to 30 minutes before due date if left blank.',
          },
        },
        {
          name: 'sentAt',
          type: 'date',
          label: 'Reminder sent at',
          admin: {
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Set automatically by Twilio after the SMS is sent.',
          },
        },
      ],
    },

    // ── Assignment ─────────────────────────────────────────────────────────────
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Assigned To',
      admin: {
        position: 'sidebar',
        description: 'Defaults to you. Assign to a VA or agent when delegating.',
      },
    },
  ],
}
