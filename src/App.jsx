import { useEffect, useRef, useState } from 'react'
import { SiteHeader, SiteFooter } from './components/layout/SiteLayout'
import useScrollReveals from './hooks/useScrollReveals'
import HomePage from './pages/home/HomePage'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  const main = useRef(null)
  useScrollReveals(main)
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    if (hash === '#inicio') {
      main.current.focus({ preventScroll: true })
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
      <button className="skip" onClick={() => main.current.focus()}>
        Pular para o conteúdo
      </button>
      <SiteHeader key={hash} />
      <main ref={main} className="project-home" id="inicio" tabIndex={-1}>
        <HomePage />
      </main>
      <SiteFooter />
    </>
  )
}
