// Vault client — fetches secrets from HashiCorp Vault at runtime.
// Falls back to process.env when VAULT_ADDR is not set (local dev).

type VaultSecrets = Record<string, string>

let cached: VaultSecrets | null = null

export async function loadSecrets(): Promise<VaultSecrets> {
  if (cached) return cached

  const addr  = process.env.VAULT_ADDR
  const token = process.env.VAULT_TOKEN

  // No Vault configured — use process.env as-is (local dev / staging dev mode)
  if (!addr || !token) {
    cached = {}
    return cached
  }

  try {
    const res = await fetch(`${addr}/v1/secret/data/dovetail/production`, {
      headers: { 'X-Vault-Token': token },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error(`[Vault] Failed to fetch secrets: ${res.status} ${res.statusText}`)
      cached = {}
      return cached
    }

    const json = await res.json() as { data?: { data?: VaultSecrets } }
    cached = json.data?.data ?? {}
    console.log(`[Vault] Loaded ${Object.keys(cached).length} secrets`)
    return cached
  } catch (err) {
    console.error('[Vault] Error fetching secrets:', err)
    cached = {}
    return cached
  }
}

// Inject Vault secrets into process.env so all existing code works unchanged.
// Called once from instrumentation.ts at server startup.
export async function injectSecrets(): Promise<void> {
  const secrets = await loadSecrets()
  for (const [key, value] of Object.entries(secrets)) {
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

// Reset cache — useful for testing
export function clearCache(): void {
  cached = null
}
