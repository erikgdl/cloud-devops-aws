import PresentationToolbar from './components/PresentationToolbar'
import SlideOverview from './components/SlideOverview'
import usePresentation from './hooks/usePresentation'
import slides from './slides'
import './presentation.css'

export default function Presentation({ number }) {
  const {
    index,
    slide,
    slideCount,
    stageRef,
    overviewRef,
    fullscreen,
    controlsOpen,
    message,
    navigate,
    toggleFullscreen,
    toggleControls,
  } = usePresentation(number)
  const Slide = slide.component

  return (
    <main
      className="n2-deck"
      data-fullscreen={fullscreen ? 'true' : undefined}
      data-controls={controlsOpen ? 'open' : 'closed'}
      aria-label="Apresentação N2 do projeto Cloud DevOps"
    >
      <div className="n2-stage" ref={stageRef}>
        <article key={slide.id} className="n2-stage-slide" aria-labelledby="n2-slide-title">
          <Slide />
        </article>
      </div>

      {fullscreen && (
        <button
          type="button"
          className="n2-controls-toggle"
          aria-expanded={controlsOpen}
          aria-controls="n2-toolbar"
          onClick={toggleControls}
        >
          {controlsOpen ? 'Ocultar controles' : 'Controles'}
        </button>
      )}

      <PresentationToolbar
        slide={slide}
        index={index}
        slideCount={slideCount}
        fullscreen={fullscreen}
        onNavigate={navigate}
        onOpenOverview={() => overviewRef.current?.showModal()}
        onToggleFullscreen={toggleFullscreen}
      />
      <div
        className="n2-progress"
        role="progressbar"
        aria-label="Progresso da apresentação"
        aria-valuemin={1}
        aria-valuemax={slideCount}
        aria-valuenow={index + 1}
      >
        <span style={{ transform: `scaleX(${(index + 1) / slideCount})` }} />
      </div>
      {message && (
        <p className="n2-feedback" role="status">
          {message}
        </p>
      )}

      <SlideOverview
        overviewRef={overviewRef}
        slides={slides}
        currentIndex={index}
        onNavigate={navigate}
      />
    </main>
  )
}
