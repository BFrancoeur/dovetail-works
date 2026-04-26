import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'revenueRange', 'featured'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'revenueRange',
      type: 'select',
      label: 'Annual revenue range',
      options: [
        { label: 'Under $1M', value: 'under-1m' },
        { label: '$1M – $2M', value: '1m-2m' },
        { label: '$2M – $4M', value: '2m-4m' },
        { label: 'Over $4M', value: 'over-4m' },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'result',
      type: 'text',
      label: 'Key result',
      admin: { description: 'e.g. "43% increase in qualified leads in 90 days"' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on homepage',
    },
  ],
}
