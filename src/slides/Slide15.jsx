import SlideLayout from './components/SlideLayout'
import { Flow, Callout } from './components/Visuals'
import Icon from './components/Icon'

const deliverySteps = [
  { title: 'Commit', detail: 'Push na master' },
  {
    title: 'CI → CD',
    detail: 'Revisão aprovada',
  },
  { title: 'GHCR', detail: 'Tag com o SHA' },
  { title: 'SSM / .env', detail: 'APP_IMAGE' },
  {
    title: 'Container',
    detail: 'Compose atualiza',
  },
]

export default function Slide15() {
  return (
    <SlideLayout
      title="Como identificar a versão publicada"
      lead="O SHA relaciona o código à imagem publicada no GHCR.
                         A referência configurada e uma inspeção do container ajudam a conferir a versão em execução."
      className="n2-version-slide"
    >
      <div className="n2-sha-identity">
        <Icon name="git" />
        <span>Uma revisão</span>
        <strong>SHA do commit</strong>
        <span>A mesma referência ao longo da entrega</span>
      </div>
      <Flow numbered items={deliverySteps} />
      <div className="n2-two-column n2-version-checks">
        <Callout label="Verificação do script">Consulta HTTP local da aplicação.</Callout>
        <Callout label="Conferência do operador">
          <code>docker compose images</code> compara a referência em execução. Acesso público e
          conteúdo são verificados separadamente.
        </Callout>
      </div>
    </SlideLayout>
  )
}
