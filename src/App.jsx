import { useState, useMemo, useCallback, useEffect } from 'react'
import { artworks as allArtworks } from './data/artworks'
import { Header } from './components/Header'
import { CategoryFilter } from './components/CategoryFilter'
import { Gallery } from './components/Gallery'
import { Lightbox } from './components/Lightbox'
import { Footer } from './components/Footer'
import styles from './App.module.css'

// Responsive column count
function useColumns() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 601)  setCols(1)
      else if (window.innerWidth < 1101) setCols(2)
      else setCols(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const columns = useColumns()

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? allArtworks
      : allArtworks.filter(a => a.category === activeCategory),
    [activeCategory]
  )

  const handleSelect = useCallback((artwork) => setSelectedArtwork(artwork), [])
  const handleClose  = useCallback(() => setSelectedArtwork(null), [])
  const handleNavigate = useCallback((artwork) => setSelectedArtwork(artwork), [])

  return (
    <div className={styles.app}>
      <Header />

      <main>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Works</h1>
          <p className={styles.heroCount}>{filtered.length} piece{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        <Gallery
          artworks={filtered}
          onSelect={handleSelect}
          columns={columns}
        />
      </main>

      <Footer />

      {selectedArtwork && (
        <Lightbox
          artwork={selectedArtwork}
          artworks={filtered}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}
