import styles from './FeatureCard.module.css'

type Props = {
  icon: string
  iconBg?: 'primary' | 'secondary' | 'accent-2' | 'accent-3' | 'danger'
  title: string
  description: string
}

export function FeatureCard({ icon, iconBg = 'primary', title, description }: Props) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${styles[iconBg]}`}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
