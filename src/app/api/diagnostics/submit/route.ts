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

    const payload = await getPayload({ config })

    const submission = await payload.create({
      collection: 'diagnostic-submissions',
      data: {
        email: answers.email,
        firstName: answers.firstName,
        companyName: answers.companyName,
        responses: answers,
        reportStatus: 'ready',
        createdAt: new Date().toISOString(),
      },
    })

    // Fire CRM non-blocking — failure doesn't break the user flow
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
    }).catch((err) => console.error('[CRM]', err))

    return NextResponse.json({ id: String(submission.id) }, { status: 201 })
  } catch (err) {
    console.error('[diagnostics/submit]', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
