import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'tenant'],
    group: 'CRM Admin',
  },
  access: {
    // Only super-admins can manage users
    create: ({ req: { user } }) => user?.role === 'super-admin',
    update: ({ req: { user } }) => user?.role === 'super-admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
    read:   ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client-view',
      options: [
        { label: 'Super Admin',    value: 'super-admin' },
        { label: 'Internal Team',  value: 'internal-team' },
        { label: 'Client View',    value: 'client-view' },
        { label: 'Agent',          value: 'agent' },
      ],
      admin: {
        description:
          'Super Admin: all tenants. Internal Team: DW tenant, full CRM access. Client View: own tenant, read-only.',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'Tenant',
      admin: {
        description: 'Required for Internal Team and Client View roles. Leave empty for Super Admin.',
        condition: (data) => data?.role !== 'super-admin',
      },
    },
  ],
}
