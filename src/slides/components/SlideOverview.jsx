export default function SlideOverview({ overviewRef, slides, currentIndex, onNavigate }) {
  function closeOnBackdrop(event) {
    if (event.target === overviewRef.current) overviewRef.current.close()
  }

  return (
    <dialog
      ref={overviewRef}
      id="n2-overview"
      className="n2-overview"
      aria-labelledby="n2-overview-title"
      onClick={closeOnBackdrop}
    >
      <div className="n2-overview-heading">
        <div>
          <span>Cloud DevOps · N2</span>
          <h2 id="n2-overview-title">Visão geral da apresentação</h2>
        </div>
        <button type="button" onClick={() => overviewRef.current.close()}>
          Fechar
        </button>
      </div>
      <ol className="n2-overview-grid">
        {slides.map((slide, slideIndex) => (
          <li key={slide.id}>
            <button
              type="button"
              aria-current={currentIndex === slideIndex ? 'step' : undefined}
              onClick={() => onNavigate(slideIndex)}
            >
              <span>{String(slideIndex + 1).padStart(2, '0')}</span>
              <strong>{slide.title}</strong>
              <small>Pessoa {slide.person}</small>
            </button>
          </li>
        ))}
      </ol>
    </dialog>
  )
}
