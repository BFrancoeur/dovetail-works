import Image from 'next/image'
import { Button } from '@/components/atoms/Button/Button'
import { FeatureCard } from '@/components/molecules/FeatureCard/FeatureCard'
import styles from './BetterLeads.module.css'

const features = [
  {
    icon: '🏡',
    iconBg: 'primary' as const,
    title: 'Serious Homeowners',
    description: 'People who understand the scope and cost of real remodeling work.',
  },
  {
    icon: '⚡',
    iconBg: 'secondary' as const,
    title: 'Faster Response',
    description: 'Leads are contacted quickly—so good opportunities don't go cold.',
  },
  {
    icon: '✅',
    iconBg: 'accent-3' as const,
    title: 'Pre-Qualified',
    description: 'Basic details are handled up front, so you're not chasing dead ends.',
  },
  {
    icon: '🔄',
    iconBg: 'accent-2' as const,
    title: 'Consistent Follow-Up',
    description: 'No more missed chances because things slipped through the cracks.',
  },
]

export function BetterLeads() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.heading}>Better Leads. Not Just More Leads.</h2>
          <p className={styles.subheading}>
            Most companies send you everything. We focus on bringing you homeowners who are{' '}
            <strong>serious, qualified</strong>, and ready to move forward.
          </p>
        </div>

        <div className={styles.grid}>
          {/* 2×2 cards */}
          <div className={styles.cards}>
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>

          {/* Photo */}
          <div className={styles.imageWrap}>
            <Image
              src="/images/contractor-client-meeting.jpg"
              alt="Contractor meeting with a qualified homeowner client"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            You spend <strong>less time chasing</strong> — and more time closing the right jobs.
          </p>
          <Button as="a" href="#audit" variant="primary" size="lg">
            Book a Lead Quality Audit
          </Button>
          <p className={styles.footnote}>Takes 15–30 minutes. No pressure.</p>
        </div>
      </div>
    </section>
  )
}
