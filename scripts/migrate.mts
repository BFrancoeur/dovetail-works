// Load config FIRST so it's in the ESM cache before payload's CJS code tries to require() it
const { default: config } = await import('../src/payload.config')

// Now import payload — its CJS internals can require() the already-cached config without a cycle
const { getPayload } = await import('payload')

// NODE_ENV=development triggers drizzle push, creating all tables on a fresh database
const payload = await getPayload({ config })
await payload.db?.destroy?.()
process.exit(0)
