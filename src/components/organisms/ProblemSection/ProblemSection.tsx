import Image from 'next/image'
import { Button } from '@/components/atoms/Button/Button'
import { ChecklistItem } from '@/components/atoms/ChecklistItem/ChecklistItem'
import styles from './ProblemSection.module.css'

const problems = [
  { text: "You're getting inquiries—but too many aren't", bold: "serious" },
  { text: "You spend time chasing leads that", bold: "go nowhere" },
  { text: "Good leads slip through the cracks when you're busy" },
  { text: "Follow-up is inconsistent or delayed" },
  { text: "You're not sure which leads are actually worth your time" },
  { text: "You're booked—but not always with the right jobs" },
]

export function ProblemSection() {
  return (
    <section id="problem" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left — text */}
          <div className={styles.text}>
            <h2 className={styles.heading}>
              Getting Leads—But Not the<br />Right Ones?
            </h2>
            <p className={styles.intro}>
              If you're busy but still dealing with tire-kickers, missed opportunities, or jobs
              that aren't worth your time—<strong>you're not alone.</strong>
            </p>
            <ul className={styles.list}>
              {problems.map(({ text, bold }, i) => (
                <ChecklistItem key={i} bold={bold}>{text}</ChecklistItem>
              ))}
            </ul>
          </div>

          {/* Right — photo */}
          <div className={styles.imageWrap}>
            <Image
              src="/images/frustrated-contractor.jpg"
              alt="Contractor frustrated by poor lead quality"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>

        {/* Conclusion */}
        <div className={styles.conclusion}>
          <p className={styles.conclusionSub}>It's not that you need more leads.</p>
          <p className={styles.conclusionBig}>
            You need <em>better ones</em>—and a better way to handle them.
          </p>
          <Button as="a" href="#audit" variant="primary" size="lg">
            Find Out Why You're Getting the Wrong Leads ›
          </Button>
          <p className={styles.footnote}>Quick, practical insights you can use right away.</p>
        </div>
      </div>
    </section>
  )
}
