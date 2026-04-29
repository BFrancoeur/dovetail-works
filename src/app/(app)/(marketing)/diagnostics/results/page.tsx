import { LandingHeader } from '@/components/organisms/LandingHeader/LandingHeader'
import { LandingHero } from '@/components/organisms/LandingHero/LandingHero'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import { Button } from '@/components/atoms/Button/Button'
import styles from './page.module.css'

type Props = { searchParams: Promise<{ id?: string }> }

export default async function DiagnosticsResultsPage({ searchParams }: Props) {
  const { id } = await searchParams

  return (
    <>
      <LandingHeader />
      <LandingHero
        headline={
          <>
            You're Getting Leads—But Too Many{' '}
            <span style={{ color: 'var(--color-secondary)' }}>Aren't Worth</span> Your Time
          </>
        }
        subheadline="Based on what you shared, here's what's likely happening inside your lead flow—and why it's costing you better jobs."
        badges={[
          { text: 'Built for remodeling companies' },
          { text: 'This is just clarity' },
        ]}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">

          <h2 className={styles.sectionHeading}>What This Means</h2>

          <div className={styles.twoCards}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>What This Means</h3>
              <ul className={styles.checkList}>
                <ChecklistItem>Your leads aren't being filtered early enough</ChecklistItem>
                <ChecklistItem>You're likely talking to homeowners who were never serious</ChecklistItem>
                <ChecklistItem>Your current system isn't controlling who reaches out</ChecklistItem>
              </ul>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitleRow}>
                <span className={styles.cardIcon}>🔍</span>
                <h3 className={styles.cardTitle}>What We're Seeing</h3>
              </div>
              <ul className={styles.checkList}>
                <ChecklistItem>Time wasted on bad-fit homeowners</ChecklistItem>
                <ChecklistItem>Missed opportunities from slow response</ChecklistItem>
                <ChecklistItem>Inconsistent follow-up hurting close rates</ChecklistItem>
              </ul>
            </div>
          </div>

          <div className={styles.callout}>
            <h3 className={styles.calloutTitle}>This Isn't a Lead Problem—It's a System Problem</h3>
            <p className={styles.calloutBody}>
              <strong>More leads won't fix this.</strong> Until your lead flow is controlled and
              qualified upfront, you'll keep dealing with the same issues—just at a larger scale.
            </p>
          </div>

          <div className={styles.twoCol}>
            <div>
              <h3 className={styles.colHeading}>What This Is Costing You</h3>
              <ul className={styles.checkList}>
                <ChecklistItem>Time wasted on bad leads</ChecklistItem>
                <ChecklistItem>Lower close rates</ChecklistItem>
                <ChecklistItem>Missed high-quality jobs</ChecklistItem>
              </ul>
            </div>
            <div>
              <h3 className={styles.colHeading}>What You Actually Want</h3>
              <ul className={styles.checkList}>
                <ChecklistItem>Better homeowners</ChecklistItem>
                <ChecklistItem>Consistent pipeline</ChecklistItem>
                <ChecklistItem>More jobs worth taking</ChecklistItem>
              </ul>
            </div>
          </div>

          <div className={styles.ctaBox}>
            <h2 className={styles.ctaHeading}>Here's the Next Step</h2>
            <p className={styles.ctaBody}>
              We'll walk through your lead flow together and show you exactly what to{' '}
              <strong>fix first.</strong>
            </p>
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

          <div className={styles.downloadRow}>
            <Button
              as="a"
              href={`/diagnostics/results/print${id ? `?id=${id}` : ''}`}
              target="_blank"
              variant="outline-dark"
              size="md"
            >
              📄 Download Report as PDF
            </Button>
            <p className={styles.downloadNote}>
              Opens a print-ready version — save as PDF from your browser.
            </p>
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
