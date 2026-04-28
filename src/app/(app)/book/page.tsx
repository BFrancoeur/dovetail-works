import { LandingHeader } from '@/components/organisms/LandingHeader/LandingHeader'
import { LandingHero } from '@/components/organisms/LandingHero/LandingHero'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import { CalEmbed } from '@/components/organisms/CalEmbed/CalEmbed'
import styles from './page.module.css'

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? 'dovetailworks/lead-flow-breakdown'

export default function BookPage() {
  return (
    <>
      <LandingHeader />

      <LandingHero
        headline={
          <>
            Let&apos;s Fix What&apos;s Slowing Your Lead{' '}
            <span style={{ color: 'var(--color-secondary)' }}>Flow Down</span>
          </>
        }
        subheadline="In 15–20 minutes, we'll identify where your leads are breaking down—and what to do about it."
        badges={[
          { text: 'No pressure' },
          { text: 'No generic advice' },
        ]}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.twoCol}>

            <div className={styles.leftCol}>
              <div className={styles.checkBlock}>
                <h2 className={styles.blockTitle}>What We&apos;ll Cover</h2>
                <ul className={styles.checkList}>
                  <ChecklistItem><strong>Where your leads</strong> are breaking down</ChecklistItem>
                  <ChecklistItem><strong>Why bad-fit homeowners</strong> keep reaching out</ChecklistItem>
                  <ChecklistItem><strong>What to fix first</strong> to start closing better jobs</ChecklistItem>
                  <ChecklistItem><strong>Whether Dovetail Works</strong> is the right fit for you</ChecklistItem>
                </ul>
              </div>

              <div className={styles.checkBlock}>
                <h2 className={styles.blockTitle}>No Pressure. No Long Calls. No Fluff.</h2>
                <ul className={styles.checkList}>
                  <ChecklistItem><strong>15–20 minutes</strong> — that&apos;s all it takes</ChecklistItem>
                  <ChecklistItem><strong>Real clarity</strong> on what&apos;s holding your pipeline back</ChecklistItem>
                  <ChecklistItem><strong>No obligation</strong> to work with us after the call</ChecklistItem>
                </ul>
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.calCard}>
                <div className={styles.calCardHeader}>
                  <span className={styles.calIcon}>📅</span>
                  <h2 className={styles.calCardTitle}>Choose a Time That Works for You</h2>
                </div>
                <CalEmbed calLink={CAL_LINK} />
              </div>
            </div>

          </div>

          <div className={styles.guaranteeBlock}>
            <h2 className={styles.guaranteeTitle}>You&apos;ll Leave Knowing Exactly What to Fix</h2>
            <p className={styles.guaranteeBody}>
              Most remodeling companies waste time on leads that were never going to convert. After this
              call, you&apos;ll know why—and what to change first.
            </p>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.trustBadge}>
              <span className={styles.trustCheck}>✓</span>
              <span>15–20 minutes</span>
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.trustCheck}>✓</span>
              <span>No pressure</span>
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.trustCheck}>✓</span>
              <span>No generic advice</span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
