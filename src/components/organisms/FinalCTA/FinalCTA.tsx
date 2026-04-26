import { Button } from '@/components/atoms/Button/Button'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import styles from './FinalCTA.module.css'

const points = [
  'Get clearer on your lead quality',
  'Stop wasting time on bad fits',
  'Focus on the jobs worth taking',
]

export function FinalCTA() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container--prose container ${styles.inner}`}>
        <h2 className={styles.heading}>
          If You're Tired of Chasing the Wrong Jobs, Let's Fix That
        </h2>
        <p className={styles.subheading}>
          A quick conversation can show you <em>exactly</em> where your leads are breaking
          down—and how to improve them.
        </p>

        <ul className={styles.list}>
          {points.map((p) => (
            <ChecklistItem key={p}>{p}</ChecklistItem>
          ))}
        </ul>

        <p className={styles.noSales}>No long calls. No sales pressure. No wasted time.</p>

        <Button as="a" href="#audit" variant="primary" size="lg">
          Book a Lead Quality Audit ›
        </Button>
        <p className={styles.footnote}>Takes 15–30 minutes. No pressure.</p>
      </div>
    </section>
  )
}
