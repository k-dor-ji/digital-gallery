import { useLazyImage } from '../hooks/useLazyImage'
import styles from './ArtworkCard.module.css'

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

function cloudUrl(id, width, quality = 'auto') {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/w_${width},q_${quality},f_webp/${id}`
}

function getUrls(artwork) {
  if (artwork.cloudinaryId && CLOUD) {
    return {
      src:       cloudUrl(artwork.cloudinaryId, 1400),
      thumbnail: cloudUrl(artwork.cloudinaryId, 400, 80),
    }
  }
  return { src: artwork.src, thumbnail: artwork.thumbnail || artwork.src }
}

export function ArtworkCard({ artwork, onClick, index }) {
  const { src, thumbnail } = getUrls(artwork)
  const { imgRef, loaded, fullLoaded } = useLazyImage(src, thumbnail)

  return (
    <div
      className={styles.card}
      onClick={() => onClick(artwork)}
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <div
        ref={imgRef}
        className={styles.imageWrap}
        style={{ paddingBottom: `${(1 / artwork.aspectRatio) * 100}%` }}
      >
        {/* Blur placeholder */}
        {loaded && !fullLoaded && (
          <img
            src={thumbnail}
            alt=""
            className={`${styles.img} ${styles.blur}`}
            aria-hidden="true"
          />
        )}

        {/* Full resolution */}
        {fullLoaded && (
          <img
            src={src}
            alt={artwork.title}
            className={`${styles.img} ${styles.full}`}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Skeleton while not loaded */}
        {!loaded && !fullLoaded && (
          <div className={styles.skeleton} />
        )}

        <div className={styles.overlay}>
          <div className={styles.info}>
            <span className={styles.title}>{artwork.title}</span>
            <span className={styles.meta}>{artwork.medium} · {artwork.year}</span>
          </div>
          <div className={styles.expandIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
