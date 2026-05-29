import { useMemo } from 'react'
import { ArtworkCard } from './ArtworkCard'
import styles from './Gallery.module.css'

function useColumns(artworks, count) {
  return useMemo(() => {
    const cols = Array.from({ length: count }, () => [])
    const heights = new Array(count).fill(0)

    artworks.forEach((artwork) => {
      const shortest = heights.indexOf(Math.min(...heights))
      cols[shortest].push(artwork)
      heights[shortest] += 1 / artwork.aspectRatio
    })

    return cols
  }, [artworks, count])
}

export function Gallery({ artworks, onSelect, columns = 3 }) {
  const cols = useColumns(artworks, columns)

  if (artworks.length === 0) {
    return (
      <div className={styles.empty}>
        <span>No works in this collection yet.</span>
      </div>
    )
  }

  let globalIndex = 0
  const colIndexMap = cols.map(col => {
    const start = globalIndex
    globalIndex += col.length
    return { col, start }
  })

  return (
    <div className={styles.grid} style={{ '--cols': columns }}>
      {colIndexMap.map(({ col, start }, ci) => (
        <div key={ci} className={styles.column}>
          {col.map((artwork, i) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              index={start + i}
              onClick={onSelect}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
