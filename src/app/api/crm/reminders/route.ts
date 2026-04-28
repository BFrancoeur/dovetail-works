import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendSMS, formatTaskReminder } from '@/lib/twilio'

// Called by a cron job every minute (or on demand).
// Finds tasks whose reminder time has passed and haven't been sent yet,
// fires the SMS, and marks the reminder as sent.

export async function POST(req: NextRequest) {
  // Simple bearer token to prevent public access
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const now     = new Date().toISOString()

  // Find tasks with a pending reminder that is due
  const tasks = await payload.find({
    collection: 'tasks',
    where: {
      and: [
        { 'reminder.enabled':   { equals: true } },
        { 'reminder.sentAt':    { exists: false } },
        { 'reminder.reminderAt': { less_than_equal: now } },
        { status: { not_equals: 'completed' } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    depth: 1,
    limit: 50,
  })

  if (tasks.docs.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  const errors: string[] = []

  for (const task of tasks.docs) {
    const contact = task.contact as Record<string, unknown> | null
    const contactName = contact
      ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') || String(contact.email ?? '')
      : undefined

    const message = formatTaskReminder({
      title:    String(task.title),
      type:     String(task.type ?? 'task'),
      dueDate:  String(task.dueDate),
      contact:  contactName,
    })

    const result = await sendSMS(message)

    if (result.success) {
      // Mark reminder as sent
      await payload.update({
        collection: 'tasks',
        id:         task.id,
        data: {
          reminder: {
            ...(task.reminder as object),
            sentAt: new Date().toISOString(),
          },
        },
      })
      sent++
    } else {
      errors.push(`Task ${task.id}: ${result.error}`)
    }
  }

  return NextResponse.json({ sent, errors: errors.length ? errors : undefined })
}
