import { useEffect, useRef, useState } from 'react'

export default function useVisibleMotion() {
  const elementRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let isVisible = false

    function updateMotionState() {
      setIsRunning(isVisible && !document.hidden && !motionPreference.matches)
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      updateMotionState()
    })
    observer.observe(elementRef.current)
    document.addEventListener('visibilitychange', updateMotionState)
    motionPreference.addEventListener('change', updateMotionState)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateMotionState)
      motionPreference.removeEventListener('change', updateMotionState)
    }
  }, [])

  return [elementRef, isRunning]
}
