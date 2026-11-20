import PresentationButton from '../../../../components/PresentationButton'
import SignalField from './SignalField'
import TechnologyStrip from './TechnologyStrip'
import './opening.css'

export default function Opening() {
  return (
    <section className="opening" aria-labelledby="opening-title">
      <div className="wrap cover-sheet">
        <div className="cover-meta">
          <span>DevOps e Computação em Nuvem</span>
          <span>Defesa</span>
        </div>
        <div className="cover-body">
          <div className="cover-copy">
            <h1 id="opening-title">
              Anatomia
              <br />
              de um deploy.
            </h1>
            <p className="lead">
              Como uma revisão de código se torna uma aplicação HTTP em um servidor Ubuntu.
            </p>
            <div className="cover-actions">
              <a className="next-link" href="#projeto">
                <span aria-hidden="true">↓</span> Ler o projeto
              </a>
              <PresentationButton arrow="↑" />
            </div>
          </div>
          <SignalField />
        </div>
      </div>
      <TechnologyStrip />
    </section>
  )
}
