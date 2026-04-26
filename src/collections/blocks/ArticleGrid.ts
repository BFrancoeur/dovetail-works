import type { Block } from 'payload'

export const ArticleGrid: Block = {
  slug: 'articleGrid',
  labels: { singular: 'Article Grid', plural: 'Article Grids' },
  fields: [
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'latest',
      options: [
        { label: 'Latest posts (auto)', value: 'latest' },
        { label: 'Pick specific posts', value: 'selected' },
      ],
    },
    {
      name: 'postType',
      type: 'select',
      defaultValue: 'blog',
      admin: { condition: (_, siblingData) => siblingData?.source === 'latest' },
      options: [
        { label: 'Blog posts', value: 'blog' },
        { label: 'Case studies', value: 'case-study' },
        { label: 'Both', value: 'all' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: { condition: (_, siblingData) => siblingData?.source === 'latest' },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: { condition: (_, siblingData) => siblingData?.source === 'selected' },
    },
  ],
}
