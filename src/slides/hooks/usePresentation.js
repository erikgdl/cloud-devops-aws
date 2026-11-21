import { useEffect, useRef, useState } from 'react'
import { getSlideIndex, getSlideHash } from '../navigation'
import slides from '../slides'

export default function usePresentation(number) {
  const slideCount = slides.length
  const index = getSlideIndex(number, slideCount)
  const slide = slides[index]
  const overviewRef = useRef(null)
  const stageRef = useRef(null)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [controlsOpen, setControlsOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${index + 1}/${slideCount} · ${slide.title} | Cloud DevOps`
    stageRef.current?.querySelector('h1')?.focus({ preventScroll: true })
    window.scrollTo(0, 0)

    return () => {
      document.title = previousTitle
    }
  }, [index, slide.title, slideCount])

  useEffect(() => {
    function handleKeyDown(event) {
      // O diálogo e os campos editáveis mantêm seus próprios atalhos.
      const isEditing = event.target?.closest?.('input, textarea, select, [contenteditable="true"]')
      const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
      if (hasModifier || overviewRef.current?.open || isEditing) return

      const shortcuts = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        PageDown: index + 1,
        PageUp: index - 1,
        Home: 0,
        End: slideCount - 1,
      }
      if (!(event.key in shortcuts)) return

      event.preventDefault()
      const nextIndex = Math.min(slideCount - 1, Math.max(0, shortcuts[event.key]))
      if (nextIndex !== index) window.location.hash = getSlideHash(nextIndex, slideCount)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [index, slideCount])

  useEffect(() => {
    function syncFullscreen() {
      setFullscreen(Boolean(document.fullscreenElement))
      setControlsOpen(false)
      stageRef.current?.querySelector('h1')?.focus({ preventScroll: true })
    }

    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  function navigate(nextIndex) {
    window.location.hash = getSlideHash(nextIndex, slideCount)
    overviewRef.current?.close()
  }

  async function toggleFullscreen() {
    try {
      setMessage('')
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      setMessage('Tela cheia indisponível. A navegação continua disponível nesta janela.')
    }
  }

  function toggleControls() {
    setControlsOpen((open) => !open)
  }

  return {
    index,
    slide,
    slideCount,
    overviewRef,
    stageRef,
    fullscreen,
    controlsOpen,
    message,
    navigate,
    toggleFullscreen,
    toggleControls,
  }
}
