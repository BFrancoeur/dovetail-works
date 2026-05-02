import { getPayload } from 'payload'
import config from '../src/payload.config'

// Runs in NODE_ENV=development so the postgres adapter uses drizzle push
// to sync the schema — creates all tables on a fresh database.
const payload = await getPayload({ config })
await payload.db?.destroy?.()
process.exit(0)
