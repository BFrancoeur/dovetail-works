import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendToCRM } from '@/lib/crm'

type CalTrigger =
  | 'BOOKING_CREATED'
  | 'BOOKING_REQUESTED'
  | 'BOOKING_REJECTED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'MEETING_ENDED'
  | 'BOOKING_NO_SHOW_UPDATED'
  | 'AFTER_GUESTS_DIDNT_JOIN_CAL_VIDEO' // verify exact name in Cal.com webhook UI

type CalAttendee = {
  name: string
  email: string
  timeZone?: string
}

type CalPayload = {
  triggerEvent: CalTrigger
  payload: {
    uid: string
    title: string
    startTime: string
    endTime: string
    attendees?: CalAttendee[]
    noShowHost?: boolean // BOOKING_NO_SHOW_UPDATED: true = host no-show, false = guest no-show
  }
}

// Maps each Cal.com event to the reportStatus value we store in Payload
const statusMap: Record<CalTrigger, string> = {
  BOOKING_CREATED:              'booked',
  BOOKING_REQUESTED:            'booking-requested',
  BOOKING_REJECTED:             'booking-rejected',
  BOOKING_CANCELLED:            'cancelled',
  BOOKING_RESCHEDULED:          'rescheduled',
  MEETING_ENDED:                'called',
  BOOKING_NO_SHOW_UPDATED:      'no-show',
  AFTER_GUESTS_DIDNT_JOIN_CAL_VIDEO: 'no-show',
}

// Maps each Cal.com event to the CRM tag we apply
const tagMap: Record<CalTrigger, string> = {
  BOOKING_CREATED:              'call-booked',
  BOOKING_REQUESTED:            'call-requested',
  BOOKING_REJECTED:             'call-rejected',
  BOOKING_CANCELLED:            'call-cancelled',
  BOOKING_RESCHEDULED:          'call-rescheduled',
  MEETING_ENDED:                'call-completed',
  BOOKING_NO_SHOW_UPDATED:      'call-no-show',
  AFTER_GUESTS_DIDNT_JOIN_CAL_VIDEO: 'call-no-show',
}

export async function POST(req: NextRequest) {
  try {
    const body: CalPayload = await req.json()
    const { triggerEvent, payload: booking } = body

    // BOOKING_NO_SHOW_UPDATED fires for both host and guest no-shows —
    // only act when the guest (lead) was the one who didn't show
    if (triggerEvent === 'BOOKING_NO_SHOW_UPDATED' && booking.noShowHost === true) {
      return NextResponse.json({ ok: true, skipped: 'host-no-show' })
    }

    const attendee = booking.attendees?.[0]
    if (!attendee?.email) {
      return NextResponse.json({ error: 'No attendee email' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Look up the most recent submission for this email
    const existing = await payload.find({
      collection: 'diagnostic-submissions',
      where: { email: { equals: attendee.email } },
      limit: 1,
      sort: '-createdAt',
    })

    const submission = existing.docs[0]

    if (submission) {
      await payload.update({
        collection: 'diagnostic-submissions',
        id: submission.id,
        data: { reportStatus: statusMap[triggerEvent] },
      })
    }

    await sendToCRM({
      email: attendee.email,
      firstName: attendee.name.split(' ')[0],
      source: 'cal-booking',
      submissionId: submission ? String(submission.id) : undefined,
      tags: ['cal-booking', tagMap[triggerEvent]],
      customFields: {
        bookingUid:        booking.uid,
        bookingTitle:      booking.title,
        bookingStartTime:  booking.startTime,
        bookingEndTime:    booking.endTime,
        bookingEvent:      triggerEvent,
        attendeeTimezone:  attendee.timeZone ?? '',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[booking-webhook]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
