import styles from './LandingHeader.module.css'

const cities = ['Ashland', 'Huntington', 'Ironton', 'Portsmouth', 'Charleston']

export function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.logo}>Dovetail Works</a>

        <nav className={styles.cities} aria-label="Service areas">
          <a href="/privacy-policy" className={styles.navLink}>Privacy Policy</a>
          <span className={styles.dot}>·</span>
          {cities.map((city, i) => (
            <span key={city} className={styles.cityGroup}>
              <a href={`#${city.toLowerCase()}`} className={styles.navLink}>{city}</a>
              {i < cities.length - 1 && <span className={styles.dot}>·</span>}
            </span>
          ))}
        </nav>

        <a href="/contact" className={styles.contact}>Contact Us</a>
      </div>
    </header>
  )
}
