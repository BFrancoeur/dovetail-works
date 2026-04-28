import type { CollectionConfig } from 'payload'
import { tenantReadAccess, tenantWriteAccess } from '@/lib/access'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'companyName', 'contactType', 'tenant'],
    description: 'CRM contacts — business owners (Dovetail Works) or homeowners (client instances).',
    group: 'CRM',
  },
  access: {
    create: tenantWriteAccess,
    read:   tenantReadAccess,
    update: tenantWriteAccess,
    delete: tenantWriteAccess,
  },
  fields: [
    // ── Tenant & type ──────────────────────────────────────────────────────────
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'contactType',
      type: 'select',
      required: true,
      defaultValue: 'homeowner',
      label: 'Contact Type',
      options: [
        { label: 'Business Owner', value: 'business-owner' },
        { label: 'Homeowner',      value: 'homeowner' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Core identity ──────────────────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName',  type: 'text', label: 'Last Name' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },

    // ── Business owner fields ──────────────────────────────────────────────────
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
      admin: {
        condition: (data) => data?.contactType === 'business-owner',
        description: 'Remodeling company name.',
      },
    },

    // ── Homeowner fields ───────────────────────────────────────────────────────
    {
      name: 'projectBudget',
      type: 'text',
      label: 'Project Budget',
      admin: {
        condition: (data) => data?.contactType === 'homeowner',
        description: 'Estimated budget for the project.',
      },
    },

    // ── Address ───────────────────────────────────────────────────────────────
    {
      name: 'address',
      type: 'group',
      label: 'Address',
      fields: [
        { name: 'street', type: 'text', label: 'Street' },
        {
          type: 'row',
          fields: [
            { name: 'city',  type: 'text', label: 'City' },
            { name: 'state', type: 'text', label: 'State' },
            { name: 'zip',   type: 'text', label: 'ZIP' },
          ],
        },
      ],
    },

    // ── Lead context ───────────────────────────────────────────────────────────
    {
      name: 'referralSource',
      type: 'select',
      label: 'Referral Source',
      options: [
        { label: 'Organic Search',      value: 'organic-search' },
        { label: 'Referral',            value: 'referral' },
        { label: 'Social Media',        value: 'social-media' },
        { label: 'Paid Ad',             value: 'paid-ad' },
        { label: 'Direct / Word of Mouth', value: 'direct' },
        { label: 'Diagnostics Form',    value: 'diagnostics-form' },
        { label: 'Other',               value: 'other' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        { name: 'tag', type: 'text', label: 'Tag' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },

    // ── Linked submissions ─────────────────────────────────────────────────────
    {
      name: 'submissions',
      type: 'relationship',
      relationTo: 'diagnostic-submissions',
      hasMany: true,
      label: 'Diagnostic Submissions',
      admin: {
        description: 'All form submissions linked to this contact. Multiple allowed — never merged.',
      },
    },
  ],
}
