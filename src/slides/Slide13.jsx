import SlideLayout from './components/SlideLayout'
import { Flow, Tech, Callout } from './components/Visuals'

const integrationSteps = [
  { title: 'Checkout', detail: 'Código da revisão', icon: 'git' },
  {
    title: 'Node.js 22',
    detail: 'Ambiente e cache npm',
    icon: 'terminal',
  },
  { title: 'npm ci', detail: 'Dependências do lockfile', icon: 'container' },
  {
    title: 'Lint',
    detail: 'npm run lint --if-present',
    icon: 'search',
  },
  { title: 'Build Vite', detail: 'npm run build', icon: 'file' },
  {
    title: 'Build Docker',
    detail: 'Construção da imagem',
    icon: 'server',
  },
]

export default function Slide13() {
  return (
    <SlideLayout
      title="CI: integração contínua"
      lead="O CI verifica dependências,
     lint e construção da aplicação e da imagem Docker."
      note="O CI aprovado confirma essas etapas. Não há testes funcionais ou de navegador configurados."
    >
      <div className="n2-ci-trigger">
        <Tech name="actions">GitHub Actions</Tech>
        <div>
          <code>push → master</code>
          <code>pull request → master</code>
        </div>
      </div>
      <Flow numbered className="n2-flow-ci" items={integrationSteps} />
      <Callout label="Validação de construção">
        O script de lint existe. A imagem do CI não é publicada; o CD realiza outro build.
      </Callout>
    </SlideLayout>
  )
}
