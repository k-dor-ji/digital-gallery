import { siteConfig } from '../data/artworks'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.name}>{siteConfig.artistName}</span>
        <div className={styles.links}>
          {siteConfig.social.instagram && (
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          )}
          {siteConfig.social.email && (
            <a href={`mailto:${siteConfig.social.email}`}>Email</a>
          )}
          {siteConfig.social.website && (
            <a href={siteConfig.social.website} target="_blank" rel="noopener noreferrer">Website</a>
          )}
        </div>
        <span className={styles.copy}>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
