import { useEffect, useRef } from 'react'
import { SiteHeader, SiteFooter } from '../../components/layout/SiteLayout'
import useScrollReveals from '../../hooks/useScrollReveals'
import HomePage from './HomePage'

export default function Home({ hash }) {
  const mainRef = useRef(null)
  useScrollReveals(mainRef)

  useEffect(() => {
    if (hash === '#inicio') {
      mainRef.current.focus({ preventScroll: true })
      window.scrollTo(0, 0)
    } else if (hash) {
      const section = document.getElementById(hash.slice(1))

      if (section) {
        section.tabIndex = -1
        section.focus({ preventScroll: true })
        section.scrollIntoView()
      }
    }
  }, [hash])

  return (
    <>
      <button className="skip" onClick={() => mainRef.current.focus()}>
        Pular para o conteúdo
      </button>
      {/* A troca de âncora remonta o cabeçalho para recolher o menu móvel. */}
      <SiteHeader key={hash} />
      <main ref={mainRef} className="project-home" id="inicio" tabIndex={-1}>
        <HomePage />
      </main>
      <SiteFooter />
    </>
  )
}
