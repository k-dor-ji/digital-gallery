import { useEffect } from 'react'

export function useKeyboard(handlers) {
  useEffect(() => {
    const handle = (e) => {
      const fn = handlers[e.key]
      if (fn) { e.preventDefault(); fn() }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [handlers])
}
