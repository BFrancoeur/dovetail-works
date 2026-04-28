/**
 * CRM Integration
 *
 * Swap the stub below for your actual CRM client when ready.
 * Supported targets: Go High Level, HubSpot, Keap, Pipedrive, ActiveCampaign, etc.
 *
 * Required env vars (add to .env when integrating):
 *   CRM_PROVIDER=ghl | hubspot | keap | ...
 *   CRM_API_KEY=...
 *   CRM_PIPELINE_ID=...   (optional — for deal/opportunity creation)
 */

export type CRMContact = {
  firstName?: string
  companyName?: string
  email: string
  phone?: string
  source: 'diagnostics-form' | 'cal-booking'
  submissionId?: string
  tags?: string[]
  customFields?: Record<string, string>
}

export type CRMResult =
  | { success: true; crmId?: string }
  | { success: false; error: string }

export async function sendToCRM(contact: CRMContact): Promise<CRMResult> {
  // ── TODO: Replace stub with real CRM client ───────────────────────────────
  //
  // Go High Level example:
  // const res = await fetch('https://rest.gohighlevel.com/v1/contacts', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.CRM_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     firstName: contact.firstName,
  //     companyName: contact.companyName,
  //     email: contact.email,
  //     source: contact.source,
  //     tags: contact.tags,
  //     customFields: contact.customFields,
  //   }),
  // })
  // const data = await res.json()
  // return res.ok ? { success: true, crmId: data.contact.id } : { success: false, error: data.message }
  //
  // HubSpot example:
  // const { Client } = await import('@hubspot/api-client')
  // const client = new Client({ accessToken: process.env.CRM_API_KEY })
  // const result = await client.crm.contacts.basicApi.create({
  //   properties: { email: contact.email, firstname: contact.firstName, company: contact.companyName },
  // })
  // return { success: true, crmId: result.id }
  //
  // ─────────────────────────────────────────────────────────────────────────

  // Stub — logs to console, always succeeds
  console.log(
    `[CRM stub] Contact queued | email: ${contact.email} | source: ${contact.source}${contact.submissionId ? ` | submission: ${contact.submissionId}` : ''}`,
  )
  return { success: true }
}
