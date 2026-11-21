export default function PresentationToolbar({
  slide,
  index,
  slideCount,
  fullscreen,
  onNavigate,
  onOpenOverview,
  onToggleFullscreen,
}) {
  return (
    <div className="n2-deck-bottom" id="n2-toolbar">
      <a href="#inicio" className="n2-deck-brand" aria-label="Voltar ao site Cloud DevOps">
        <img src="./favicon.svg" width="24" height="24" alt="" />
        <span>
          Cloud <b>DevOps</b>
        </span>
      </a>
      <div className="n2-presenter">
        <span>Pessoa {slide.person}</span>
        <strong>{slide.chapter}</strong>
      </div>
      <div
        className="n2-navigation"
        aria-label="Navegação entre slides"
        title="Use também as setas esquerda e direita do teclado"
      >
        <button type="button" onClick={() => onNavigate(index - 1)} disabled={index === 0}>
          Anterior
        </button>
        <p className="n2-counter" role="status" aria-live="polite" aria-atomic="true">
          <span className="n2-sr-only">Slide </span>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <span aria-hidden="true"> / </span>
          <span className="n2-sr-only"> de </span>
          {slideCount}
        </p>
        <button
          type="button"
          className="n2-next"
          onClick={() => onNavigate(index + 1)}
          disabled={index === slideCount - 1}
        >
          Próximo
        </button>
      </div>
      <div className="n2-deck-tools">
        <button
          type="button"
          onClick={onOpenOverview}
          aria-haspopup="dialog"
          aria-controls="n2-overview"
        >
          Visão geral
        </button>
        <button type="button" onClick={onToggleFullscreen} disabled={!document.fullscreenEnabled}>
          {fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        </button>
      </div>
    </div>
  )
}
