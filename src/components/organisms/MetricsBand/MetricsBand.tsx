import type { MetricSnapshot } from '@/types/crm'
import styles from './MetricsBand.module.css'

type Props = {
  metrics: MetricSnapshot[]
}

function fmt(value: number | string, format?: 'number' | 'percent'): string {
  if (value === '--' || value === null || value === undefined) return '--'
  if (format === 'percent') return `${value}%`
  return String(value)
}

export function MetricsBand({ metrics }: Props) {
  return (
    <div className={styles.band}>
      <div className={styles.header}>
        <span className={styles.periodLabel}>Today</span>
        <span className={styles.periodLabel}>This Week</span>
        <span className={styles.periodLabel}>This Month</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.metric}>
            <span className={styles.metricLabel}>{m.label}</span>
            <div className={styles.metricValues}>
              <span className={styles.metricValue}>{fmt(m.today,  m.format)}</span>
              <span className={styles.metricValue}>{fmt(m.week,   m.format)}</span>
              <span className={styles.metricValue}>{fmt(m.month,  m.format)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
