import { useState, useEffect } from 'react'
import { siteConfig } from '../data/artworks'
import styles from './Header.module.css'

export function Header({ onContactClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.wordmark}>
          <span className={styles.name}>{siteConfig.artistName}</span>
          <span className={styles.divider}>—</span>
          <span className={styles.tagline}>{siteConfig.tagline}</span>
        </div>

        <nav className={styles.nav}>
          {siteConfig.social.instagram && (
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              Instagram
            </a>
          )}
          {siteConfig.social.email && (
            <a
              href={`mailto:${siteConfig.social.email}`}
              className={styles.navLink}
            >
              Contact
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
