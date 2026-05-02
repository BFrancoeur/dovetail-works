import type { CollectionConfig } from 'payload'
import { tenantReadAccess, tenantWriteAccess } from '../lib/access.ts'

export const DiagnosticSubmissions: CollectionConfig = {
  slug: 'diagnostic-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'companyName', 'reportStatus', 'tenant', 'createdAt'],
    description: 'Submissions from the diagnostics form.',
    group: 'CRM',
  },
  access: {
    create: () => true, // public form submits here
    read:   tenantReadAccess,
    update: tenantWriteAccess,
    delete: tenantWriteAccess,
  },
  fields: [
    // ── Tenant ────────────────────────────────────────────────────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: { position: 'sidebar' },
    },

    // ── Contact link ──────────────────────────────────────────────────────────
    {
      name: 'contact',
      type: 'relationship',
      relationTo: 'contacts',
      label: 'Linked Contact',
      admin: {
        position: 'sidebar',
        description: 'Set automatically when a contact record is created from this submission.',
      },
    },

    // ── Submission data ───────────────────────────────────────────────────────
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'companyName',
      type: 'text',
    },
    {
      name: 'annualRevenue',
      type: 'select',
      label: 'Annual revenue range',
      options: [
        { label: 'Under $1M', value: 'under-1m' },
        { label: '$1M – $2M', value: '1m-2m' },
        { label: '$2M – $4M', value: '2m-4m' },
        { label: 'Over $4M',  value: 'over-4m' },
      ],
    },
    {
      name: 'responses',
      type: 'json',
      label: 'Form responses',
      admin: { description: 'Raw answers from the multi-step diagnostic form.' },
    },
    {
      name: 'reportStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending',           value: 'pending' },
        { label: 'Generating',        value: 'generating' },
        { label: 'Ready',             value: 'ready' },
        { label: 'Failed',            value: 'failed' },
        // Booking lifecycle
        { label: 'Booking Requested', value: 'booking-requested' },
        { label: 'Booking Rejected',  value: 'booking-rejected' },
        { label: 'Booked',            value: 'booked' },
        { label: 'Rescheduled',       value: 'rescheduled' },
        { label: 'Cancelled',         value: 'cancelled' },
        { label: 'Called',            value: 'called' },
        { label: 'No Show',           value: 'no-show' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'reportFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Generated PDF report',
      admin: { condition: (data) => data?.reportStatus === 'ready' },
    },
    {
      name: 'aiPromptSnapshot',
      type: 'textarea',
      label: 'AI prompt used',
      admin: {
        description: 'Stored for debugging and reproducibility.',
        readOnly: true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
