import type { CollectionConfig } from 'payload'
import { HeroBlock } from './blocks/HeroBlock.ts'
import { TextSection } from './blocks/TextSection.ts'
import { CTABanner } from './blocks/CTABanner.ts'
import { TestimonialsRow } from './blocks/TestimonialsRow.ts'
import { StatsRow } from './blocks/StatsRow.ts'
import { ArticleGrid } from './blocks/ArticleGrid.ts'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL path, e.g. "about" → /about. Use "home" for the homepage.' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, TextSection, CTABanner, TestimonialsRow, StatsRow, ArticleGrid],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO / AEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta title' },
        { name: 'description', type: 'textarea', label: 'Meta description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Social share image' },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          label: 'Hide from search engines',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
