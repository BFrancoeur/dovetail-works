// Twilio SMS — outbound only. Used for task due-date reminders.

export type SMSResult =
  | { success: true; sid: string }
  | { success: false; error: string }

export async function sendSMS(body: string): Promise<SMSResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const from       = process.env.TWILIO_FROM_NUMBER
  const to         = process.env.TWILIO_TO_NUMBER

  if (!accountSid || !authToken || !from || !to) {
    console.warn('[Twilio] Missing credentials — skipping SMS')
    return { success: false, error: 'Missing Twilio credentials' }
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  })

  const data = await res.json() as { sid?: string; message?: string; code?: number }

  if (!res.ok) {
    console.error('[Twilio] SMS failed:', data.message)
    return { success: false, error: data.message ?? 'Unknown error' }
  }

  return { success: true, sid: data.sid ?? '' }
}

export function formatTaskReminder(task: {
  title:    string
  type:     string
  dueDate:  string
  contact?: string
}): string {
  const due  = new Date(task.dueDate)
  const time = due.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const contact = task.contact ? ` — ${task.contact}` : ''
  return `🔔 DW Reminder: [${task.type.toUpperCase()}] ${task.title}${contact} due at ${time}`
}
