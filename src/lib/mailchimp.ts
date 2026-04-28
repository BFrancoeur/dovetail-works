/**
 * Mailchimp integration — manages contacts and automated email sequences.
 *
 * Required env vars (add when account is ready):
 *   MAILCHIMP_API_KEY=     e.g. abc123-us21
 *   MAILCHIMP_AUDIENCE_ID= e.g. a1b2c3d4e5
 *
 * The server prefix (us21 etc.) is the last part of your API key after the dash.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type MailchimpTag =
  | 'nurture-c-results-no-booking'  // Drop-out C: viewed results, didn't book
  | 'nurture-a-abandoned'           // Drop-out A: left before form
  | 'nurture-b-no-results'          // Drop-out B: submitted form, didn't view results
  | 'nurture-d-no-show'             // Drop-out D: booked, no-show
  | 'nurture-active-deal'           // Active deal nurture sequence

export type SubscribeResult =
  | { success: true;  id: string }
  | { success: false; error: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCredentials(): { apiKey: string; server: string; audienceId: string } | null {
  const apiKey     = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    console.warn('[Mailchimp] Missing credentials — skipping')
    return null
  }

  const server = apiKey.split('-').pop() ?? 'us1'
  return { apiKey, server, audienceId }
}

function baseUrl(server: string, audienceId: string): string {
  return `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}`
}

function authHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
}

// ── Subscribe or update a contact ────────────────────────────────────────────

export async function subscribeContact({
  email,
  firstName,
  tags = [],
}: {
  email:      string
  firstName?: string
  tags?:      MailchimpTag[]
}): Promise<SubscribeResult> {
  const creds = getCredentials()
  if (!creds) return { success: false, error: 'Missing credentials' }

  const { apiKey, server, audienceId } = creds

  // Mailchimp uses MD5 hash of lowercase email as the member ID
  const { createHash } = await import('crypto')
  const emailHash = createHash('md5').update(email.toLowerCase()).digest('hex')

  // PUT upserts — safe to call multiple times for the same email
  const res = await fetch(`${baseUrl(server, audienceId)}/members/${emailHash}`, {
    method:  'PUT',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': authHeader(apiKey),
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields:  { FNAME: firstName ?? '' },
      tags,
    }),
  })

  const data = await res.json() as { id?: string; title?: string; detail?: string }

  if (!res.ok) {
    console.error('[Mailchimp] Subscribe failed:', data.title, data.detail)
    return { success: false, error: data.detail ?? data.title ?? 'Unknown error' }
  }

  return { success: true, id: data.id ?? emailHash }
}

// ── Apply tags to trigger automations ────────────────────────────────────────

export async function applyTags(email: string, tags: MailchimpTag[]): Promise<void> {
  const creds = getCredentials()
  if (!creds) return

  const { apiKey, server, audienceId } = creds
  const { createHash } = await import('crypto')
  const emailHash = createHash('md5').update(email.toLowerCase()).digest('hex')

  await fetch(`${baseUrl(server, audienceId)}/members/${emailHash}/tags`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': authHeader(apiKey),
    },
    body: JSON.stringify({
      tags: tags.map((name) => ({ name, status: 'active' })),
    }),
  })
}

// ── Enroll in nurture sequence ────────────────────────────────────────────────
// Call this when a contact hits a drop-out point.
// Subscribes them to the audience and applies the sequence tag,
// which triggers the Mailchimp automation for that sequence.

export async function enrollInNurture({
  email,
  firstName,
  dropOut,
}: {
  email:     string
  firstName?: string
  dropOut:   'A' | 'B' | 'C' | 'D'
}): Promise<SubscribeResult> {
  const tagMap: Record<string, MailchimpTag> = {
    A: 'nurture-a-abandoned',
    B: 'nurture-b-no-results',
    C: 'nurture-c-results-no-booking',
    D: 'nurture-d-no-show',
  }

  const tag = tagMap[dropOut]

  // Subscribe first (upsert), then apply the tag that triggers the automation
  const result = await subscribeContact({ email, firstName, tags: [tag] })
  if (!result.success) return result

  await applyTags(email, [tag])
  return result
}
