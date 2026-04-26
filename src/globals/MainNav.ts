import type { GlobalConfig } from 'payload'

export const MainNav: GlobalConfig = {
  slug: 'main-nav',
  label: 'Main Navigation',
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Nav items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'link',
          options: [
            { label: 'Single link', value: 'link' },
            { label: 'Dropdown', value: 'dropdown' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: { condition: (_, s) => s?.type === 'link' },
        },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          admin: { condition: (_, s) => s?.type === 'dropdown' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
            { name: 'description', type: 'text', admin: { description: 'Shown in mega-menu style dropdowns' } },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Header CTA button',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Book a call' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
