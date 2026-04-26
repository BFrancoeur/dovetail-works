import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Global settings applied across the entire site.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Dovetail Works',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (dark background)',
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'bookingUrl',
      type: 'text',
      label: 'Book-a-call URL',
      admin: { description: 'Cal.com, Calendly, or similar scheduling link.' },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
      ],
    },
    {
      name: 'seoDefaults',
      type: 'group',
      label: 'SEO defaults',
      fields: [
        { name: 'title', type: 'text', label: 'Default meta title' },
        { name: 'description', type: 'textarea', label: 'Default meta description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default social share image' },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        { name: 'gtmId', type: 'text', label: 'Google Tag Manager ID', admin: { description: 'e.g. GTM-XXXXXXX' } },
        { name: 'gaId', type: 'text', label: 'Google Analytics 4 ID', admin: { description: 'e.g. G-XXXXXXXXXX' } },
      ],
    },
  ],
}
