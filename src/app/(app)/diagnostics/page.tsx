import { LandingHeader } from '@/components/organisms/LandingHeader/LandingHeader'
import { LandingHero } from '@/components/organisms/LandingHero/LandingHero'
import { DiagnosticsForm } from '@/components/organisms/DiagnosticsForm/DiagnosticsForm'
import { SiteFooter } from '@/components/organisms/SiteFooter/SiteFooter'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import styles from './page.module.css'

const heroBadges = [
  { text: 'Built for remodeling companies' },
  { text: 'Takes 2–3 minutes' },
  { text: 'No fluff—just clarity' },
  { text: 'No spam. Just insights.' },
]

const willLearn = [
  { text: 'Where your leads', bold: 'are breaking down' },
  { text: "What's costing you", bold: 'time and money' },
  { text: 'What to fix first', bold: 'for better jobs' },
]

const willDiscover = [
  { text: 'Why', bold: "you're getting the wrong leads" },
  { text: 'Where', bold: 'your process is breaking down' },
  { text: "What's costing", bold: 'you time and money' },
  { text: 'What to fix first' },
]

export default function DiagnosticsPage() {
  return (
    <>
      <LandingHeader />
      <LandingHero
        headline={
          <>
            Find Out What's Actually<br />
            Causing Your <span style={{ color: 'var(--color-secondary)' }}>Bad Leads</span>
          </>
        }
        subheadline="Most remodeling companies don't realize where their leads are breaking down. This quick breakdown shows you exactly what's happening—and what to fix first."
        badges={heroBadges}
      />

      {/* Main content */}
      <section className={`section ${styles.section}`}>
        <div className="container">
          <div className={styles.grid}>

            {/* Left — learning outcomes */}
            <div className={styles.left}>
              <div className={styles.block}>
                <h2 className={styles.blockHeading}>Here's What You'll Learn</h2>
                <div className={styles.checkBox}>
                  <ul className={styles.checkList}>
                    {willLearn.map(({ text, bold }, i) => (
                      <ChecklistItem key={i} bold={bold}>{text}</ChecklistItem>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.block}>
                <h2 className={styles.blockHeading}>What You'll Discover</h2>
                <div className={styles.checkBox}>
                  <ul className={styles.checkList}>
                    {willDiscover.map(({ text, bold }, i) => (
                      <ChecklistItem key={i} bold={bold}>{text}</ChecklistItem>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.timeBlock}>
                <h3 className={styles.timeHeading}>This takes less than 2 minutes.</h3>
                <p className={styles.timeText}>
                  Most remodelers complete this in one sitting and immediately see
                  what's been holding them back.
                </p>
              </div>
            </div>

            {/* Right — multi-step form */}
            <div className={styles.right}>
              <DiagnosticsForm />
            </div>

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
