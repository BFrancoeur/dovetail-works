/**
 * Print-optimized report page.
 * Opened in a new tab by the "Download Report as PDF" button.
 * User saves as PDF via browser: File → Print → Save as PDF
 */

import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { GeneratedReport } from '@/lib/generateReport'
import styles from './print.module.css'

type Props = { searchParams: Promise<{ id?: string }> }

async function getSubmission(id: string) {
  const payload = await getPayload({ config })
  try { return await payload.findByID({ collection: 'diagnostic-submissions', id }) }
  catch { return null }
}

function parseReport(submission: any): GeneratedReport | null {
  try {
    const raw = submission?.responses?._report
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const fallback: GeneratedReport = {
  heroHeadline: "Your Lead Flow Breakdown",
  heroSubheadline: "Based on your diagnostic answers, here's what we found.",
  whatThisMeans: [
    "Your leads aren't being filtered early enough",
    "You're likely talking to homeowners who were never serious",
    "Your current system isn't controlling who reaches out",
  ],
  whatWereSeeing: [
    'Time wasted on bad-fit homeowners',
    'Missed opportunities from slow response',
    'Inconsistent follow-up hurting close rates',
  ],
  systemProblemTitle: "This Isn't a Lead Problem—It's a System Problem",
  systemProblemBody: "More leads won't fix this. Until your lead flow is controlled and qualified upfront, you'll keep dealing with the same issues—just at a larger scale.",
  costingYou: ['Time wasted on bad leads', 'Lower close rates', 'Missed high-quality jobs'],
  whatYouWant: ['Better homeowners', 'Consistent pipeline', 'More jobs worth taking'],
  nextStepHeading: "Here's the Next Step",
  nextStepBody: "Book a 15–20 minute Lead Flow Breakdown call. We'll show you exactly what to fix first.",
}

export default async function PrintPage({ searchParams }: Props) {
  const { id } = await searchParams
  if (!id) notFound()
  const submission = await getSubmission(id)
  if (!submission) notFound()
  const report = parseReport(submission) ?? fallback
  const name = (submission as any).firstName
  const company = (submission as any).companyName

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lead Flow Breakdown — Dovetail Works</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={styles.body}>
        <div className={styles.page}>

          {/* Header */}
          <header className={styles.header}>
            <p className={styles.logo}>Dovetail Works</p>
            <p className={styles.logoSub}>Lead Systems for Remodeling Companies</p>
          </header>

          {/* Title */}
          <div className={styles.titleBlock}>
            <p className={styles.reportLabel}>LEAD FLOW BREAKDOWN REPORT</p>
            <h1 className={styles.headline}>{report.heroHeadline}</h1>
            <p className={styles.subheadline}>{report.heroSubheadline}</p>
            {(name || company) && (
              <p className={styles.recipient}>
                Prepared for: <strong>{[name, company].filter(Boolean).join(' — ')}</strong>
              </p>
            )}
          </div>

          {/* What This Means */}
          <div className={styles.twoCol}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>What This Means</h2>
              <ul className={styles.list}>
                {report.whatThisMeans.map((item, i) => (
                  <li key={i} className={styles.listItem}><span className={styles.check}>✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>What We're Seeing</h2>
              <ul className={styles.list}>
                {report.whatWereSeeing.map((item, i) => (
                  <li key={i} className={styles.listItem}><span className={styles.check}>✓</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* System Problem */}
          <div className={styles.callout}>
            <h2 className={styles.calloutTitle}>{report.systemProblemTitle}</h2>
            <p className={styles.calloutBody}>{report.systemProblemBody}</p>
          </div>

          {/* Costs vs Wants */}
          <div className={styles.twoCol}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>What This Is Costing You</h2>
              <ul className={styles.list}>
                {report.costingYou.map((item, i) => (
                  <li key={i} className={styles.listItem}><span className={styles.check}>✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>What You Actually Want</h2>
              <ul className={styles.list}>
                {report.whatYouWant.map((item, i) => (
                  <li key={i} className={styles.listItem}><span className={styles.check}>✓</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Step CTA */}
          <div className={styles.ctaBlock}>
            <h2 className={styles.ctaTitle}>{report.nextStepHeading}</h2>
            <p className={styles.ctaBody}>{report.nextStepBody}</p>
            <p className={styles.ctaUrl}>Book your call: dovetailworks.com/book</p>
            <p className={styles.ctaBadges}>✓ 15–20 minutes &nbsp;&nbsp; ✓ No pressure &nbsp;&nbsp; ✓ No generic advice</p>
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} Dovetail Works · dovetailworks.com · (740) 630-0000</p>
            <p>Ashland · Huntington · Ironton · Portsmouth · Charleston</p>
          </footer>

        </div>

        {/* Auto-open print dialog */}
        <script dangerouslySetInnerHTML={{ __html: 'window.onload = () => window.print()' }} />
      </body>
    </html>
  )
}
