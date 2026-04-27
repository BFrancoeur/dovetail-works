import { Button } from '@/components/atoms/Button/Button'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>For Remodelers Who Want Better Jobs</p>
        <h1 className={styles.headline}>
          Book Better Remodeling Jobs<br />
          Without the <span className={styles.accent}>Tire-Kickers</span>
        </h1>
        <p className={styles.subheadline}>
          We help remodeling companies across Ashland, Huntington, Ironton, Portsmouth, and
          Charleston attract serious homeowners and respond to new leads fast—so you can focus
          on the jobs worth taking.
        </p>
        <div className={styles.ctas}>
          <Button as="a" href="#audit" variant="primary" size="lg">
            Get More High-Quality Remodeling Jobs →
          </Button>
          <Button as="a" href="#problem" variant="secondary" size="lg">
            Find Out Why You're Getting the Wrong Leads →
          </Button>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>🏗️</span>
          <div>
            <strong>Built for Remodeling Companies</strong>
            <br />
            Doing $1M–$4M Annually
          </div>
        </div>
      </div>
    </section>
  )
}
