import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users.js'
import { Tenants } from './collections/Tenants.js'
import { Contacts } from './collections/Contacts.js'
import { PipelineEntries } from './collections/PipelineEntries.js'
import { Activities } from './collections/Activities.js'
import { Tasks } from './collections/Tasks.js'
import { Media } from './collections/Media.js'
import { Pages } from './collections/Pages.js'
import { Posts } from './collections/Posts.js'
import { Testimonials } from './collections/Testimonials.js'
import { DiagnosticSubmissions } from './collections/DiagnosticSubmissions.js'
import { SiteSettings } from './globals/SiteSettings.js'
import { MainNav } from './globals/MainNav.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),

  editor: lexicalEditor({}),

  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM ?? 'noreply@localhost',
    defaultFromName: 'Dovetail Works',
    transportOptions: {
      host: process.env.SMTP_HOST ?? 'mailpit',
      port: Number(process.env.SMTP_PORT ?? 1025),
      ignoreTLS: true,
    },
  }),

  admin: {
    user: 'users',
  },

  collections: [Users, Tenants, Contacts, PipelineEntries, Activities, Tasks, Media, Pages, Posts, Testimonials, DiagnosticSubmissions],

  globals: [SiteSettings, MainNav],

  upload: {
    limits: {
      fileSize: 100_000_000,
    },
  },

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
