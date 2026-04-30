// Next.js instrumentation — runs once at server startup.
// Fetches all secrets from Vault and injects them into process.env
// so every existing lib file that reads process.env works unchanged.

export async function register() {
  // Only run on the server, not during edge runtime or client builds
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { injectSecrets } = await import('@/lib/vault')
    await injectSecrets()
  }
}
