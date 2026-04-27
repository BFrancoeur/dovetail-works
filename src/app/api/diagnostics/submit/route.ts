import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendToCRM } from '@/lib/crm'
import { generateReport } from '@/lib/generateReport'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Record<string, string> = body.answers ?? {}

    if (!answers.email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Save submission with pending status
    const submission = await payload.create({
      collection: 'diagnostic-submissions',
      data: {
        email: answers.email,
        firstName: answers.firstName,
        companyName: answers.companyName,
        responses: answers,
        reportStatus: 'pending',
        createdAt: new Date().toISOString(),
      },
    })

    const submissionId = String(submission.id)

    // Fire CRM and report generation concurrently — neither blocks the response
    Promise.all([
      sendToCRM({
        email: answers.email,
        firstName: answers.firstName,
        companyName: answers.companyName,
        source: 'diagnostics-form',
        submissionId,
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
      }),
      generateReport(answers)
        .then(async (report) => {
          await payload.update({
            collection: 'diagnostic-submissions',
            id: submission.id,
            data: {
              responses: { ...answers, _report: JSON.stringify(report) },
              reportStatus: 'ready',
            },
          })
        })
        .catch(async (err) => {
          console.error('[report generation]', err)
          await payload.update({
            collection: 'diagnostic-submissions',
            id: submission.id,
            data: { reportStatus: 'failed' },
          })
        }),
    ]).catch((err) => console.error('[background tasks]', err))

    return NextResponse.json({ id: submissionId, status: 'pending' }, { status: 201 })
  } catch (err) {
    console.error('[diagnostics/submit]', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
