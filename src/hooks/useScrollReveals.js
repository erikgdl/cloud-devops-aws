import { useLayoutEffect } from 'react'

export default function useScrollReveals(container) {
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const page = container.current
    let observer
    let inset

    function observeReadingArea() {
      const nextInset = Math.min(180, Math.round(window.innerHeight * 0.2))
      if (nextInset === inset) return
      inset = nextInset
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries, activeObserver) => {
          let order = 0
          for (const { target, isIntersecting } of entries) {
            if (!isIntersecting) continue
            target.style.setProperty('--entry-delay', `${Math.min(order++, 3) * 95}ms`)
            target.classList.add('revealed')
            activeObserver.unobserve(target)
          }
        },
        { rootMargin: `0px 0px -${inset}px 0px` },
      )
      page
        .querySelectorAll('[data-reveal]:not(.revealed)')
        .forEach((block) => observer.observe(block))
    }

    observeReadingArea()
    page.classList.add('has-reveals')
    window.addEventListener('resize', observeReadingArea)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observeReadingArea)
      page.classList.remove('has-reveals')
    }
  }, [container])
}
