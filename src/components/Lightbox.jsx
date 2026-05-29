import { useState, useEffect, useCallback, useRef } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import styles from './Lightbox.module.css'

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

function getFullSrc(artwork) {
  if (artwork.cloudinaryId && CLOUD) {
    return `https://res.cloudinary.com/${CLOUD}/image/upload/q_auto,f_webp/${artwork.cloudinaryId}`
  }
  return artwork.src
}

export function Lightbox({ artwork, artworks, onClose, onNavigate }) {
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const touchStart = useRef(null)

  const currentIndex = artworks.findIndex(a => a.id === artwork.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < artworks.length - 1

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Reset loaded state on artwork change
  useEffect(() => { setImgLoaded(false) }, [artwork])

  const navigate = useCallback((dir) => {
    if (transitioning) return
    const nextIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0 || nextIndex >= artworks.length) return

    setDirection(dir)
    setTransitioning(true)
    setTimeout(() => {
      onNavigate(artworks[nextIndex])
      setTransitioning(false)
      setDirection(null)
    }, 260)
  }, [transitioning, currentIndex, artworks, onNavigate])

  useKeyboard({
    ArrowLeft:  () => navigate('prev'),
    ArrowRight: () => navigate('next'),
    Escape:     onClose,
  })

  // Touch swipe
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const delta = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) navigate(delta > 0 ? 'next' : 'prev')
    touchStart.current = null
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button className={styles.close} onClick={onClose} aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Counter */}
      <div className={styles.counter}>
        <span>{currentIndex + 1}</span>
        <span className={styles.counterDivider}>/</span>
        <span>{artworks.length}</span>
      </div>

      {/* Image container */}
      <div
        className={`${styles.imageWrap} ${transitioning ? styles[`exit_${direction}`] : styles.enter}`}
        style={{ '--aspect-ratio': artwork.aspectRatio }}
      >
        {!imgLoaded && <div className={styles.spinner} />}
        <img
          key={artwork.id}
          src={getFullSrc(artwork)}
          alt={artwork.title}
          className={`${styles.image} ${imgLoaded ? styles.visible : ''}`}
          onLoad={() => setImgLoaded(true)}
          draggable={false}
        />
      </div>

      {/* Info panel */}
      <div className={styles.infoPanel}>
        <div className={styles.infoLeft}>
          <h2 className={styles.infoTitle}>{artwork.title}</h2>
          <p className={styles.infoMeta}>{artwork.medium} · {artwork.year}</p>
          {artwork.description && (
            <p className={styles.infoDesc}>{artwork.description}</p>
          )}
          {artwork.tags && (
            <div className={styles.tags}>
              {artwork.tags.map(t => (
                <span key={t} className={styles.tag}>#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prev/Next */}
      {hasPrev && (
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => navigate('prev')}
          aria-label="Previous artwork"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => navigate('next')}
          aria-label="Next artwork"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
