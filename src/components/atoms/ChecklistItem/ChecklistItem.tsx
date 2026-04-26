import styles from './ChecklistItem.module.css'

type Props = { children: React.ReactNode; bold?: string }

export function ChecklistItem({ children, bold }: Props) {
  return (
    <li className={styles.item}>
      <span className={styles.icon} aria-hidden="true">✓</span>
      <span>{children}{bold && <> <strong>{bold}</strong></>}</span>
    </li>
  )
}
