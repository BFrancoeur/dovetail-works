import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { LandingHeader } from '@/components/organisms/LandingHeader/LandingHeader'
import { LandingHero } from '@/components/organisms/LandingHero/LandingHero'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import { Button } from '@/components/atoms/Button/Button'
import type { GeneratedReport } from '@/lib/generateReport'
import styles from './page.module.css'

type Props = {
  searchParams: Promise<{ id?: string }>
}

async function getSubmission(id: string) {
  const payload = await getPayload({ config })
  try {
    return await payload.findByID({ collection: 'diagnostic-submissions', id })
  } catch {
    return null
  }
}

function parseReport(submission: any): GeneratedReport | null {
  try {
    const raw = submission?.responses?._report
    if (!raw) return null
    return JSON.parse(raw) as GeneratedReport
  } catch {
    return null
  }
}

// Fallback content shown while report is generating or if generation failed
const fallbackReport: GeneratedReport = {
  heroHeadline: "You're Getting Leads—But Too Many Aren't Worth Your Time",
  heroSubheadline:
    "Based on what you shared, here's what's likely happening inside your lead flow—and why it's costing you better jobs.",
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
  systemProblemBody:
    "More leads won't fix this. Until your lead flow is controlled and qualified upfront, you'll keep dealing with the same issues—just at a larger scale.",
  costingYou: ['Time wasted on bad leads', 'Lower close rates', 'Missed high-quality jobs'],
  whatYouWant: ['Better homeowners', 'Consistent pipeline', 'More jobs worth taking'],
  nextStepHeading: "Here's the Next Step",
  nextStepBody:
    "We'll walk through your lead flow together and show you exactly what to fix first.",
}

export default async function DiagnosticsResultsPage({ searchParams }: Props) {
  const { id } = await searchParams

  if (!id) notFound()

  const submission = await getSubmission(id)
  if (!submission) notFound()

  const report = parseReport(submission) ?? fallbackReport
  const isPending = submission.reportStatus === 'pending'
  const firstName = (submission as any).firstName

  return (
    <>
      <LandingHeader />
      <LandingHero
        headline={
          <>
            {report.heroHeadline.split(/\b(Aren't Worth|Bad Leads|Wrong Leads|Not Worth)\b/).map(
              (part, i) =>
                ['Aren\'t Worth', 'Bad Leads', 'Wrong Leads', 'Not Worth'].includes(part) ? (
                  <span key={i} style={{ color: 'var(--color-secondary)' }}>{part}</span>
                ) : (
                  part
                )
            )}
          </>
        }
        subheadline={report.heroSubheadline}
        badges={[
          { text: 'Built for remodeling companies' },
          { text: 'This is just clarity' },
        ]}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">

          {/* Generating notice */}
          {isPending && (
            <div className={styles.generatingBanner}>
              ⏳ Your personalized report is being generated — this page will update shortly.
              <button className={styles.refreshBtn} onClick={undefined}>Refresh</button>
            </div>
          )}

          {/* "What This Means" heading */}
          <h2 className={styles.sectionHeading}>What This Means</h2>

          {/* Two cards */}
          <div className={styles.twoCards}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>What This Means</h3>
              <ul className={styles.checkList}>
                {report.whatThisMeans.map((item, i) => (
                  <ChecklistItem key={i}>{item}</ChecklistItem>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitleRow}>
                <span className={styles.cardIcon}>🔍</span>
                <h3 className={styles.cardTitle}>What We're Seeing</h3>
              </div>
              <ul className={styles.checkList}>
                {report.whatWereSeeing.map((item, i) => (
                  <ChecklistItem key={i}>{item}</ChecklistItem>
                ))}
              </ul>
            </div>
          </div>

          {/* System problem callout */}
          <div className={styles.callout}>
            <h3 className={styles.calloutTitle}>{report.systemProblemTitle}</h3>
            <p className={styles.calloutBody}>{report.systemProblemBody}</p>
          </div>

          {/* Costs vs wants */}
          <div className={styles.twoCol}>
            <div>
              <h3 className={styles.colHeading}>What This Is Costing You</h3>
              <ul className={styles.checkList}>
                {report.costingYou.map((item, i) => (
                  <ChecklistItem key={i}>{item}</ChecklistItem>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.colHeading}>What You Actually Want</h3>
              <ul className={styles.checkList}>
                {report.whatYouWant.map((item, i) => (
                  <ChecklistItem key={i}>{item}</ChecklistItem>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA box */}
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaHeading}>{report.nextStepHeading}</h2>
            <p className={styles.ctaBody}>{report.nextStepBody}</p>
            <p className={styles.ctaNote}>
              This is where most remodelers finally see what's actually been holding them back.
            </p>
            <Button as="a" href="https://calendly.com" target="_blank" variant="primary" size="lg">
              Book Your Lead Flow Breakdown →
            </Button>
            <p className={styles.ctaTrust}>
              Built for remodeling companies that want better jobs—<em>not just more leads.</em>
            </p>
            <div className={styles.ctaBadges}>
              <span><span className={styles.check}>✓</span> 15–20 minutes</span>
              <span><span className={styles.check}>✓</span> No pressure</span>
              <span><span className={styles.check}>✓</span> No generic advice</span>
            </div>
          </div>

          {/* Download CTA */}
          <div className={styles.downloadRow}>
            <Button as="a" href={`/diagnostics/results/print?id=${id}`} target="_blank" variant="outline-dark" size="md">
              📄 Download Report as PDF
            </Button>
            <p className={styles.downloadNote}>Opens a print-ready version — save as PDF from your browser.</p>
          </div>

          <p className={styles.trustLine}>
            Built for remodeling companies that <strong>want better jobs</strong>—not just more leads.
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
