'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './CRMSidebar.module.css'

const PIPELINES = [
  { key: 'primary',        label: 'Primary Pipeline' },
  { key: 'active-deal',    label: 'Active Deal' },
  { key: 'lead-nurturing', label: 'Lead Nurturing' },
]

type Task = {
  id: string
  title: string
  type: string
  dueDate: string
  status: string
}

type Props = {
  todayTasks: Task[]
}

export function CRMSidebar({ todayTasks }: Props) {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <p className={styles.brandName}>Dovetail Works</p>
        <p className={styles.brandSub}>CRM</p>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navHeading}>Pipelines</p>
        {PIPELINES.map((p) => {
          const href = `/crm/pipeline/${p.key}`
          const active = pathname === href
          return (
            <Link
              key={p.key}
              href={href}
              className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
            >
              {p.label}
            </Link>
          )
        })}
      </nav>

      <div className={styles.myDay}>
        <p className={styles.navHeading}>My Day</p>
        {todayTasks.length === 0 && (
          <p className={styles.emptyTasks}>Nothing due today.</p>
        )}
        {todayTasks.map((task) => (
          <div key={task.id} className={styles.taskItem}>
            <span className={styles.taskDot} data-type={task.type} />
            <span className={styles.taskTitle}>{task.title}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
