import { Button } from '@/components/atoms/Button/Button'
import styles from './Process.module.css'

const steps = [
  {
    icon: '📅',
    title: 'Pick a Time',
    description: 'Choose a time that works for you—no back-and-forth.',
  },
  {
    icon: '🔎',
    title: 'Walk Through Your Leads',
    description: 'We look at what you're currently getting and where things are breaking down.',
  },
  {
    icon: '📋',
    title: 'Get Clear Next Steps',
    description:
      'You leave with practical ways to improve your lead quality and response.',
  },
]

export function Process() {
  return (
    <section id="audit" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>What Happens When You Reach Out</h2>
          <p className={styles.subheading}>
            A quick, straightforward conversation to see what's working, what's not, and what
            to <strong>fix first</strong>.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={step.title} className={styles.stepWrapper}>
              <div className={styles.step}>
                <div className={styles.iconWrap}>
                  <span className={styles.icon}>{step.icon}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={styles.arrow} aria-hidden="true">→</div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            No long calls. No sales pressure. No wasted time.
          </p>
          <Button as="a" href="#audit" variant="outline-light" size="lg">
            Book a Lead Quality Audit ›
          </Button>
          <p className={styles.footnote}>Takes 15–30 minutes. No pressure.</p>
        </div>
      </div>
    </section>
  )
}
