import { AutoPrint } from '@/components/organisms/PrintReport/AutoPrint'
import styles from './print.module.css'

export default function PrintPage() {
  return (
    <div className={styles.page}>
      <AutoPrint />

      <header className={styles.header}>
        <p className={styles.logo}>Dovetail Works</p>
        <p className={styles.logoSub}>Lead Systems for Remodeling Companies</p>
      </header>

      <div className={styles.titleBlock}>
        <p className={styles.reportLabel}>LEAD FLOW BREAKDOWN REPORT</p>
        <h1 className={styles.headline}>
          You're Getting Leads—But Too Many Aren't Worth Your Time
        </h1>
        <p className={styles.subheadline}>
          Based on your diagnostic answers, here's what's likely happening inside your lead
          flow—and why it's costing you better jobs.
        </p>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What This Means</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Your leads aren't being filtered early enough</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>You're likely talking to homeowners who were never serious</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Your current system isn't controlling who reaches out</li>
          </ul>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What We're Seeing</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Time wasted on bad-fit homeowners</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Missed opportunities from slow response</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Inconsistent follow-up hurting close rates</li>
          </ul>
        </div>
      </div>

      <div className={styles.callout}>
        <h2 className={styles.calloutTitle}>This Isn't a Lead Problem—It's a System Problem</h2>
        <p className={styles.calloutBody}>
          More leads won't fix this. Until your lead flow is controlled and qualified upfront,
          you'll keep dealing with the same issues—just at a larger scale.
        </p>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What This Is Costing You</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Time wasted on bad leads</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Lower close rates</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Missed high-quality jobs</li>
          </ul>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What You Actually Want</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Better homeowners</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>Consistent pipeline</li>
            <li className={styles.listItem}><span className={styles.check}>✓</span>More jobs worth taking</li>
          </ul>
        </div>
      </div>

      <div className={styles.ctaBlock}>
        <h2 className={styles.ctaTitle}>Here's the Next Step</h2>
        <p className={styles.ctaBody}>
          We'll walk through your lead flow together and show you exactly what to fix first.
        </p>
        <p className={styles.ctaUrl}>Book your call: dovetailworks.com/book</p>
        <p className={styles.ctaBadges}>✓ 15–20 minutes &nbsp;&nbsp; ✓ No pressure &nbsp;&nbsp; ✓ No generic advice</p>
      </div>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Dovetail Works · dovetailworks.com · (740) 630-0000</p>
        <p>Ashland · Huntington · Ironton · Portsmouth · Charleston</p>
      </footer>
    </div>
  )
}
