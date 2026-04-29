import { LandingHeader } from '@/components/organisms/LandingHeader/LandingHeader'
import { LandingHero } from '@/components/organisms/LandingHero/LandingHero'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import { Button } from '@/components/atoms/Button/Button'
import styles from './page.module.css'

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK
  ? `https://cal.com/${process.env.NEXT_PUBLIC_CAL_LINK}`
  : '/book'

export default function WhyPage() {
  return (
    <>
      <LandingHeader />

      <LandingHero
        headline={
          <>
            This Isn&apos;t a Sales Call.{' '}
            <span style={{ color: 'var(--color-secondary)' }}>It&apos;s a Diagnosis.</span>
          </>
        }
        subheadline="Here's exactly what happens in 15 minutes — and why it's worth your time."
        badges={[
          { text: 'No pitch' },
          { text: 'No obligation' },
        ]}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">

          {/* What we actually do */}
          <div className={styles.block}>
            <h2 className={styles.blockHeading}>What We Do in 15 Minutes</h2>
            <p className={styles.blockBody}>
              Most remodeling companies don&apos;t have a lead problem — they have a system problem.
              The call is built to find it fast.
            </p>
            <ul className={styles.checkList}>
              <ChecklistItem><strong>Look at where your leads come from</strong> and which sources are sending the wrong homeowners</ChecklistItem>
              <ChecklistItem><strong>Identify where leads drop off</strong> — before you talk to them, during the estimate, or after</ChecklistItem>
              <ChecklistItem><strong>Find the first thing to fix</strong> — not a list of 12 things, just the one that moves the needle fastest</ChecklistItem>
              <ChecklistItem><strong>Tell you honestly</strong> whether Dovetail Works is the right fit — or whether it isn&apos;t</ChecklistItem>
            </ul>
          </div>

          {/* What they walk away with */}
          <div className={styles.callout}>
            <h2 className={styles.calloutTitle}>What You Walk Away With</h2>
            <p className={styles.calloutBody}>
              A clear picture of where your lead flow is breaking down — and one specific thing
              to fix first. Not a proposal. Not a follow-up sequence. Just the answer you came
              looking for when you filled out the diagnostic.
            </p>
          </div>

          {/* Cost of not doing it */}
          <div className={styles.block}>
            <h2 className={styles.blockHeading}>What Happens If You Don&apos;t</h2>
            <p className={styles.blockBody}>
              Nothing changes. You keep taking estimates on jobs that go nowhere. You keep
              responding to homeowners who were never serious. You keep wondering why your
              close rate isn&apos;t where it should be — without a clear answer.
            </p>
            <p className={styles.blockBody}>
              The leads aren&apos;t going to fix themselves. And more leads won&apos;t fix
              a broken system — they&apos;ll just make the problem bigger.
            </p>
          </div>

          {/* CTA */}
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaHeading}>15 Minutes. One Clear Answer.</h2>
            <p className={styles.ctaBody}>
              Pick a time that works and we&apos;ll get into it. No pitch. No pressure.
              If it&apos;s not a fit, I&apos;ll tell you in the first five minutes.
            </p>
            <Button as="a" href={CAL_LINK} target="_blank" variant="primary" size="lg">
              Book Your Call →
            </Button>
            <div className={styles.ctaBadges}>
              <span><span className={styles.check}>✓</span> 15–20 minutes</span>
              <span><span className={styles.check}>✓</span> No pressure</span>
              <span><span className={styles.check}>✓</span> No generic advice</span>
            </div>
            <p className={styles.ctaSignoff}>— Brian, Dovetail Works</p>
          </div>

        </div>
      </section>

      <SiteFooter />
    </>
  )
}
