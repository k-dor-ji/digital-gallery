import { CATEGORIES } from '../data/artworks'
import styles from './CategoryFilter.module.css'

export function CategoryFilter({ active, onChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.pill} ${active === cat.id ? styles.active : ''}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
