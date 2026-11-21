import SlideLayout from './components/SlideLayout'
import { Callout } from './components/Visuals'
import Icon from './components/Icon'

export default function Slide16() {
  return (
    <SlideLayout
      title="Monitoramento com Uptime Kuma"
      lead="O Uptime Kuma realiza consultas aos endpoints cadastrados e mantém um histórico dos resultados.
                         Essa observação permite identificar períodos de indisponibilidade e acompanhar o retorno do serviço."
      note="Uma resposta HTTP não valida toda a interface. Uma falha do host interrompe aplicação e monitor."
    >
      <div className="n2-two-column n2-monitor-layout">
        <div className="n2-monitor-diagram">
          <div className="n2-monitor-heading">
            <Icon name="pulse" />
            <strong>Uptime Kuma</strong>
            <span>Esquema de leitura</span>
          </div>
          <div className="n2-monitor-target">
            <span>Endpoint cadastrado</span>
            <div className="n2-monitor-signal" aria-hidden="true">
              <svg viewBox="0 0 400 70" fill="none">
                <path d="M0 36h100l20-16 22 33 25-43 26 48 22-22h185" className="n2-wire" />
                <path
                  d="M0 36h100l20-16 22 33 25-43 26 48 22-22h185"
                  className="n2-packet"
                  pathLength="100"
                />
              </svg>
            </div>
            <strong>Consulta → resposta → registro</strong>
          </div>
          <p>Representação ilustrativa, sem métricas de um ambiente real.</p>
        </div>
        <div className="n2-monitor-reading">
          <div>
            <span>Estado atual</span>
            <p>Resposta do alvo cadastrado.</p>
          </div>
          <div>
            <span>Tempo de resposta</span>
            <p>Duração das consultas.</p>
          </div>
          <div>
            <span>Histórico e disponibilidade</span>
            <p>Falhas, recuperações e período observado.</p>
          </div>
          <Callout label="Persistência e demonstração">
            Volume mantém configuração e histórico. Alvos são cadastrados manualmente; na defesa,
            mostrar o alvo e os eventos reais.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
