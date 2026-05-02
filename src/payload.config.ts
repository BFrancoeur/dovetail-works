import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users.ts'
import { Tenants } from './collections/Tenants.ts'
import { Contacts } from './collections/Contacts.ts'
import { PipelineEntries } from './collections/PipelineEntries.ts'
import { Activities } from './collections/Activities.ts'
import { Tasks } from './collections/Tasks.ts'
import { Media } from './collections/Media.ts'
import { Pages } from './collections/Pages.ts'
import { Posts } from './collections/Posts.ts'
import { Testimonials } from './collections/Testimonials.ts'
import { DiagnosticSubmissions } from './collections/DiagnosticSubmissions.ts'
import { SiteSettings } from './globals/SiteSettings.ts'
import { MainNav } from './globals/MainNav.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
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
