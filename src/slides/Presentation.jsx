import {useEffect, useRef, useState} from 'react'
import slides from './slides'
import './presentation.css'

export default function Presentation({number}) {
    const index = Math.min(slides.length - 1, Math.max(0, Math.floor(Number.isFinite(number) ? number : 1) - 1))
    const slide = slides[index]
    const Slide = slide.component
    const overview = useRef(null)
    const stage = useRef(null)
    const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
    const [controlsOpen, setControlsOpen] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const previousTitle = document.title
        document.title = `${index + 1}/18 · ${slide.title} | Cloud DevOps`
        stage.current?.querySelector('h1')?.focus({preventScroll: true})
        window.scrollTo(0, 0)
        return () => {
            document.title = previousTitle
        }
    }, [index, slide.title])

    useEffect(() => {
        function onKeyDown(event) {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || overview.current?.open || event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return
            const shortcuts = {
                ArrowRight: index + 1,
                ArrowLeft: index - 1,
                PageDown: index + 1,
                PageUp: index - 1,
                Home: 0,
                End: slides.length - 1
            }
            if (!(event.key in shortcuts)) return
            event.preventDefault()
            const next = Math.min(slides.length - 1, Math.max(0, shortcuts[event.key]))
            if (next !== index) window.location.hash = `/apresentacao/${next + 1}`
        }

        const syncFullscreen = () => {
            setFullscreen(Boolean(document.fullscreenElement))
            setControlsOpen(false)
            stage.current?.querySelector('h1')?.focus({preventScroll: true})
        }
        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('fullscreenchange', syncFullscreen)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('fullscreenchange', syncFullscreen)
        }
    }, [index])

    function navigate(next) {
        window.location.hash = `/apresentacao/${Math.min(slides.length, Math.max(1, next + 1))}`
        overview.current?.close()
    }

    async function toggleFullscreen() {
        try {
            setMessage('')
            if (document.fullscreenElement) await document.exitFullscreen()
            else await document.documentElement.requestFullscreen()
        } catch {
            setMessage('Tela cheia indisponível. A navegação continua disponível nesta janela.')
        }
    }

    return <main className="n2-deck" data-fullscreen={fullscreen ? 'true' : undefined}
                 data-controls={controlsOpen ? 'open' : 'closed'}
                 aria-label="Apresentação N2 do projeto Cloud DevOps">
        <div className="n2-stage" ref={stage}>
            <article key={slide.id} className="n2-stage-slide" aria-labelledby="n2-slide-title"><Slide/></article>
        </div>

        {fullscreen && <button type="button" className="n2-controls-toggle"
                               aria-expanded={controlsOpen} aria-controls="n2-toolbar"
                               onClick={() => setControlsOpen(open => !open)}>
            {controlsOpen ? 'Ocultar controles' : 'Controles'}
        </button>}

        <div className="n2-deck-bottom" id="n2-toolbar">
            <a href="#inicio" className="n2-deck-brand" aria-label="Voltar ao site Cloud DevOps"><img
                src="./favicon.svg" width="24" height="24" alt=""/><span>Cloud <b>DevOps</b></span></a>
            <div className="n2-presenter"><span>Pessoa {slide.person}</span><strong>{slide.chapter}</strong></div>
            <div className="n2-navigation" aria-label="Navegação entre slides"
                 title="Use também as setas esquerda e direita do teclado">
                <button type="button" onClick={() => navigate(index - 1)} disabled={index === 0}>Anterior</button>
                <p className="n2-counter" role="status" aria-live="polite" aria-atomic="true"><span
                    className="n2-sr-only">Slide </span><b>{String(index + 1).padStart(2, '0')}</b><span
                    aria-hidden="true"> / </span><span className="n2-sr-only"> de </span>18</p>
                <button type="button" className="n2-next" onClick={() => navigate(index + 1)}
                        disabled={index === slides.length - 1}>Próximo
                </button>
            </div>
            <div className="n2-deck-tools">
                <button type="button" onClick={() => overview.current?.showModal()} aria-haspopup="dialog"
                        aria-controls="n2-overview">Visão geral
                </button>
                <button type="button" onClick={toggleFullscreen}
                        disabled={!document.fullscreenEnabled}>{fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}</button>
            </div>
        </div>
        <div className="n2-progress" role="progressbar" aria-label="Progresso da apresentação" aria-valuemin={1}
             aria-valuemax={18} aria-valuenow={index + 1}><span
            style={{transform: `scaleX(${(index + 1) / slides.length})`}}/></div>
        {message && <p className="n2-feedback" role="status">{message}</p>}

        <dialog ref={overview} id="n2-overview" className="n2-overview" aria-labelledby="n2-overview-title"
                onClick={event => {
                    if (event.target === overview.current) overview.current.close()
                }}>
            <div className="n2-overview-heading">
                <div><span>Cloud DevOps · N2</span><h2 id="n2-overview-title">Visão geral da apresentação</h2></div>
                <button type="button" onClick={() => overview.current.close()}>Fechar</button>
            </div>
            <ol className="n2-overview-grid">{slides.map((item, i) => <li key={item.id}>
                <button type="button" aria-current={index === i ? 'step' : undefined} onClick={() => navigate(i)}>
                    <span>{String(i + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>Pessoa {item.person}</small>
                </button>
            </li>)}</ol>
        </dialog>
    </main>
}
