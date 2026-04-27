import styles from './LandingFooter.module.css'

const cities = ['Ashland', 'Huntington', 'Ironton', 'Portsmouth', 'Charleston']

const links = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Contact Us', href: '/contact' },
]

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.logo}>Dovetail Works</p>
        <p className={styles.tagline}>
          <em>Lead Systems</em> for Remodeling Companies
        </p>
        <p className={styles.cities}>
          {cities.map((city, i) => (
            <span key={city}>
              {city}
              {i < cities.length - 1 && <span className={styles.pipe}>|</span>}
            </span>
          ))}
        </p>
        <p className={styles.phone}>
          <a href="tel:+17406300000">(740) 630-0000</a>
        </p>
      </div>

      <div className={styles.bar}>
        <div className="container">
          <nav className={styles.links} aria-label="Footer links">
            {links.map(({ label, href }, i) => (
              <span key={href} className={styles.linkGroup}>
                <a href={href} className={styles.link}>{label}</a>
                {i < links.length - 1 && <span className={styles.pipe}>|</span>}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
