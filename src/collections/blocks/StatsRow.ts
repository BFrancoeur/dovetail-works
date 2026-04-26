import type { Block } from 'payload'

export const StatsRow: Block = {
  slug: 'statsRow',
  labels: { singular: 'Stats Row', plural: 'Stats Rows' },
  fields: [
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}
