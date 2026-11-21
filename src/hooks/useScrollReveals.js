import { useLayoutEffect } from 'react'

const MAX_BOTTOM_INSET = 180
const READING_AREA_RATIO = 0.2
const MAX_STAGGER_INDEX = 3
const REVEAL_DELAY_MS = 95

export default function useScrollReveals(containerRef) {
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const pageElement = containerRef.current
    let observer
    let bottomInset

    function observeReadingArea() {
      const nextBottomInset = Math.min(
        MAX_BOTTOM_INSET,
        Math.round(window.innerHeight * READING_AREA_RATIO),
      )
      if (nextBottomInset === bottomInset) return
      bottomInset = nextBottomInset
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries, activeObserver) => {
          let revealOrder = 0
          for (const { target, isIntersecting } of entries) {
            if (!isIntersecting) continue
            const delay = Math.min(revealOrder++, MAX_STAGGER_INDEX) * REVEAL_DELAY_MS
            target.style.setProperty('--entry-delay', `${delay}ms`)
            target.classList.add('revealed')
            // Cada bloco aparece uma vez; o resize observa apenas os que ainda estão ocultos.
            activeObserver.unobserve(target)
          }
        },
        { rootMargin: `0px 0px -${bottomInset}px 0px` },
      )
      pageElement
        .querySelectorAll('[data-reveal]:not(.revealed)')
        .forEach((blockElement) => observer.observe(blockElement))
    }

    observeReadingArea()
    pageElement.classList.add('has-reveals')
    window.addEventListener('resize', observeReadingArea)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observeReadingArea)
      pageElement.classList.remove('has-reveals')
    }
  }, [containerRef])
}
