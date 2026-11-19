import { useRef, useState } from 'react'
import PresentationButton from '../PresentationButton'
import './layout.css'

const repository = 'https://github.com/erikgdl/cloud-devops-aws'

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
  const [open, setOpen] = useState(false)
  const toggle = useRef(null)
  function closeMenu(event) {
    if (event.key === 'Escape' && open) {
      setOpen(false)
      toggle.current.focus()
    }
  }
  return (
    <header onKeyDown={closeMenu}>
      <div className="wrap mast">
        <Brand />
        <button
          ref={toggle}
          className="menu"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>
        <nav
          id="site-nav"
          className={open ? 'expanded' : ''}
          aria-label="Principal"
          onClick={() => setOpen(false)}
        >
          <a href="#projeto">Contexto</a>
          <a href="#arquitetura">Arquitetura</a>
          <a href="#tecnologias">Tecnologias</a>
          <a href={repository}>GitHub</a>
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
        <a href={repository}>Repositório no GitHub ↗</a>
      </div>
    </footer>
  )
}
