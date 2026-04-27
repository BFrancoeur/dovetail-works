import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendToCRM } from '@/lib/crm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Record<string, string> = body.answers ?? {}

    if (!answers.email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // ── Save submission to Payload ────────────────────────────────────────
    const payload = await getPayload({ config })

    const submission = await payload.create({
      collection: 'diagnostic-submissions',
      data: {
        email: answers.email,
        firstName: answers.firstName,
        companyName: answers.companyName,
        annualRevenue: undefined, // not collected in form yet
        responses: answers,
        reportStatus: 'pending',
        createdAt: new Date().toISOString(),
      },
    })

    // ── Send to CRM (non-blocking — failure doesn't break the user flow) ──
    sendToCRM({
      email: answers.email,
      firstName: answers.firstName,
      companyName: answers.companyName,
      source: 'diagnostics-form',
      submissionId: String(submission.id),
      tags: ['diagnostics-form', 'lead'],
      customFields: {
        workType: answers.workType ?? '',
        projectSize: answers.projectSize ?? '',
        monthlyLeads: answers.monthlyLeads ?? '',
        leadSource: answers.leadSource ?? '',
        responseTime: answers.responseTime ?? '',
        biggestProblem: answers.biggestProblem ?? '',
        followUp: answers.followUp ?? '',
      },
    }).catch((err) => {
      // Log but don't fail the request — CRM errors shouldn't block the user
      console.error('[CRM] Failed to send contact:', err)
    })

    return NextResponse.json({ id: submission.id, status: 'pending' }, { status: 201 })
  } catch (err) {
    console.error('[diagnostics/submit]', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
