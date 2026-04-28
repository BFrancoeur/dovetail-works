import type { Access, Where } from 'payload'

// ── Role checks ───────────────────────────────────────────────────────────────

export const isSuperAdmin = (user: Record<string, unknown> | null | undefined): boolean =>
  user?.role === 'super-admin'

export const isInternalTeam = (user: Record<string, unknown> | null | undefined): boolean =>
  user?.role === 'internal-team'

export const isClientView = (user: Record<string, unknown> | null | undefined): boolean =>
  user?.role === 'client-view'

export const isAgent = (user: Record<string, unknown> | null | undefined): boolean =>
  user?.role === 'agent'

// ── System agent identity ─────────────────────────────────────────────────────
// Agents pass this as their `user` parameter. It is NOT a real DB record.
// Access control sees role: 'agent' and applies read-only restrictions.
// Agents must NEVER use overrideAccess: true.

export const AGENT_USER = {
  id:         'agent-system',
  role:       'agent',
  email:      'agent@dovetailworks.internal',
  collection: 'users',
} as const

// ── Tenant ID resolution ──────────────────────────────────────────────────────

export const getTenantId = (user: Record<string, unknown> | null | undefined): string | null => {
  if (!user?.tenant) return null
  if (typeof user.tenant === 'object' && user.tenant !== null) {
    return String((user.tenant as Record<string, unknown>).id ?? '')
  }
  return String(user.tenant)
}

// ── Reusable access control functions ────────────────────────────────────────

/** Super-admins only — used for tenant and user management. */
export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

/** Logged-in users only — no guest access. */
export const mustBeLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/**
 * Read: super-admin sees everything; agents and everyone else are tenant-scoped.
 * Agents are allowed to read so they can propose informed actions.
 */
export const tenantReadAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const tenantId = getTenantId(user)
  if (!tenantId) return false

  return { tenant: { equals: tenantId } }
}

/**
 * Write: super-admin and internal-team only.
 * Agents are BLOCKED — they must use guardedAgentAction() after Slack approval.
 * Client-view is read-only.
 */
export const tenantWriteAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  if (isClientView(user)) return false
  if (isAgent(user)) return false  // agents never write directly

  const tenantId = getTenantId(user)
  if (!tenantId) return false

  return { tenant: { equals: tenantId } }
}

/**
 * Agent create access for Activities only — agents can log proposals.
 * All other writes are blocked via tenantWriteAccess.
 */
export const agentOrTeamWriteAccess: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  if (isAgent(user)) {
    const tenantId = getTenantId(user)
    return tenantId ? { tenant: { equals: tenantId } } : false
  }
  if (isClientView(user)) return false

  const tenantId = getTenantId(user)
  if (!tenantId) return false

  return { tenant: { equals: tenantId } }
}
