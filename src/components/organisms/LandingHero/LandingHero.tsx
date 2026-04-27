import styles from './LandingHero.module.css'

type Badge = { text: string }

type Props = {
  eyebrow?: string
  headline: React.ReactNode
  subheadline: string
  badges?: Badge[]
}

export function LandingHero({ headline, subheadline, badges }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.subheadline}>{subheadline}</p>
        {badges && badges.length > 0 && (
          <div className={styles.badges}>
            {badges.map((b) => (
              <span key={b.text} className={styles.badge}>
                <span className={styles.check}>✓</span>
                {b.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
