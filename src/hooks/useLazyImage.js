import { useState, useEffect, useRef } from 'react'

export function useLazyImage(src, thumbnail) {
  const [loaded, setLoaded] = useState(false)
  const [fullLoaded, setFullLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!src) return

    // Keep references so they aren't garbage collected
    const thumb = new Image()
    const full = new Image()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()

          if (thumbnail) {
            thumb.onload = () => setLoaded(true)
            thumb.src = thumbnail
          } else {
            setLoaded(true)
          }

          full.onload = () => setFullLoaded(true)
          full.src = src
        }
      },
      { rootMargin: '200px' }
    )

    if (imgRef.current) observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
      thumb.onload = null
      full.onload = null
    }
  }, [src, thumbnail])

  return { imgRef, loaded, fullLoaded }
}