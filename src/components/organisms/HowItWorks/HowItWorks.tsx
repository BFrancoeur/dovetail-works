import Image from 'next/image'
import { Button } from '@/components/atoms/Button/Button'
import { FeatureCard } from '@/components/molecules/FeatureCard/FeatureCard'
import styles from './HowItWorks.module.css'

const features = [
  {
    icon: '🎯',
    iconBg: 'danger' as const,
    title: 'Attract the Right Homeowners',
    description: 'Show up in a way that appeals to serious clients—no price shoppers.',
  },
  {
    icon: '⚡',
    iconBg: 'secondary' as const,
    title: 'Respond Fast',
    description: 'Every lead gets a quick response—even when you're on a job.',
  },
  {
    icon: '🔍',
    iconBg: 'accent-3' as const,
    title: 'Filter Early',
    description: 'Know who's worth your time before the conversation goes too far.',
  },
]

export function HowItWorks() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>How You Start Booking Better Jobs</h2>
          <p className={styles.subheading}>
            A simple system that brings in better leads, <strong>responds fast</strong>, and
            filters out the ones you don't want.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Cards */}
          <div className={styles.cards}>
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>

          {/* Photo */}
          <div className={styles.imageWrap}>
            <Image
              src="/images/happy-contractor.jpg"
              alt="Confident remodeling contractor"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            No complicated systems. No <strong>extra work</strong>. Just a better way to handle
            your leads.
          </p>
          <Button as="a" href="#audit" variant="outline-light" size="lg">
            See How This Works for Your Business ›
          </Button>
          <p className={styles.footnote}>Simple and straightforward.</p>
        </div>
      </div>
    </section>
  )
}
