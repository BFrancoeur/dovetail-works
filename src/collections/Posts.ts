import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'postType', 'status', 'publishedAt'],
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
    },
    {
      name: 'postType',
      type: 'select',
      required: true,
      defaultValue: 'blog',
      options: [
        { label: 'Blog post', value: 'blog' },
        { label: 'Case study', value: 'case-study' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown in article grids and social shares.' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
    },
    // CTA embedded in post — sends readers into the funnel
    {
      name: 'cta',
      type: 'group',
      label: 'In-post CTA',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'target',
          type: 'select',
          defaultValue: 'diagnostics',
          options: [
            { label: 'Diagnostics page', value: 'diagnostics' },
            { label: 'Book a call', value: 'booking' },
            { label: 'Custom URL', value: 'custom' },
          ],
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: { condition: (_, s) => s?.target === 'custom' },
        },
        { name: 'headline', type: 'text', defaultValue: 'Ready to grow your pipeline?' },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Get your free diagnostics report' },
      ],
    },
    // Case-study-specific fields
    {
      name: 'caseStudy',
      type: 'group',
      label: 'Case study details',
      admin: { condition: (_, s) => s?.postType === 'case-study' },
      fields: [
        { name: 'clientName', type: 'text' },
        { name: 'industry', type: 'text', defaultValue: 'Home remodeling' },
        { name: 'revenueRange', type: 'text', label: 'Client revenue range' },
        {
          name: 'results',
          type: 'array',
          label: 'Key results',
          fields: [
            { name: 'metric', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
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
          name: 'faqSchema',
          type: 'array',
          label: 'FAQ schema (AEO)',
          admin: { description: 'Q&A pairs added as FAQ structured data for AI search.' },
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
