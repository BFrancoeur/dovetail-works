import type { Block } from 'payload'

export const TestimonialsRow: Block = {
  slug: 'testimonialsRow',
  labels: { singular: 'Testimonials Row', plural: 'Testimonials Rows' },
  fields: [
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
  ],
}
