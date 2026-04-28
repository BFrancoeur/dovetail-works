import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'type', 'active'],
    description: 'One record per CRM instance — Dovetail Works plus each client.',
    group: 'CRM Admin',
  },
  access: {
    // Only super-admins can create, update, or delete tenants
    create: ({ req: { user } }) => user?.role === 'super-admin',
    update: ({ req: { user } }) => user?.role === 'super-admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
    read:   ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Company Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'Machine-readable ID — e.g. "dovetail-works", "abc-remodeling".' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'Dovetail Works (owner)', value: 'dovetail-works' },
        { label: 'Client',                 value: 'client' },
      ],
    },
    {
      // Determines which contact fields are shown for this tenant
      name: 'contactFlavor',
      type: 'select',
      required: true,
      defaultValue: 'homeowner',
      label: 'Contact Type',
      options: [
        { label: 'Business Owner', value: 'business-owner' },
        { label: 'Homeowner',      value: 'homeowner' },
      ],
      admin: {
        description: 'Business Owner = Dovetail Works leads. Homeowner = client leads.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: { position: 'sidebar' },
    },
  ],
}
