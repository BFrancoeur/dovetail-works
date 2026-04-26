import styles from './SiteFooter.module.css'

const links = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms and Conditions', href: '/terms' },
  { label: 'Data Privacy', href: '/data-privacy' },
  { label: 'Contact Us', href: '/contact' },
]

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Left — brand */}
        <div className={styles.brand}>
          <p className={styles.logo}>Dovetail Works</p>
          <p className={styles.tagline}>Lead Generation for Home Remodeling Companies</p>
          <address className={styles.contact}>
            <p>123 Main Street, Suite 100</p>
            <p>
              <a href="tel:+13044560000">(304) 456-0000</a>
            </p>
          </address>
        </div>

        {/* Right — links */}
        <nav className={styles.links} aria-label="Footer navigation">
          <p className={styles.linksHeading}>Links</p>
          <ul className={styles.linkList}>
            {links.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className={styles.link}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.bar}>
        <div className="container">
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Dovetail Works | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
