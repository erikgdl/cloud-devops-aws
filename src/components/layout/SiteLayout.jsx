import { useRef, useState } from 'react'
import PresentationButton from '../PresentationButton'
import './layout.css'

const repositoryUrl = 'https://github.com/erikgdl/cloud-devops-aws'

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Cloud DevOps, início">
      <img src="./favicon.svg" alt="" width="38" height="38" />
      <span className="wordmark">
        Cloud <b>DevOps</b>
      </span>
    </a>
  )
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuToggleRef = useRef(null)

  function handleHeaderKeyDown(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false)
      menuToggleRef.current.focus()
    }
  }

  return (
    <header onKeyDown={handleHeaderKeyDown}>
      <div className="wrap mast">
        <Brand />
        <button
          ref={menuToggleRef}
          className="menu"
          aria-expanded={isMenuOpen}
          aria-controls="site-nav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'Fechar' : 'Menu'}
        </button>
        <nav
          id="site-nav"
          className={isMenuOpen ? 'expanded' : ''}
          aria-label="Principal"
          onClick={() => setIsMenuOpen(false)}
        >
          <a href="#projeto">Contexto</a>
          <a href="#arquitetura">Arquitetura</a>
          <a href="#tecnologias">Tecnologias</a>
          <a href={repositoryUrl}>GitHub</a>
          <PresentationButton />
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <Brand />
        <p>DevOps e Computação em Nuvem</p>
        <a href="./creditos-icones.txt">Créditos dos ícones</a>
        <a href={repositoryUrl}>Repositório no GitHub ↗</a>
      </div>
    </footer>
  )
}
