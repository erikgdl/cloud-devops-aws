import { useEffect, useRef, useState } from 'react'

export default function useVisibleMotion() {
  const ref = useRef(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const update = () => setRunning(visible && !document.hidden && !preference.matches)
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(ref.current)
    document.addEventListener('visibilitychange', update)
    preference.addEventListener('change', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      preference.removeEventListener('change', update)
    }
  }, [])

  return [ref, running]
}
