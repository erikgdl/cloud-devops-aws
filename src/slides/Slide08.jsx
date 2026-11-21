import SlideLayout from './components/SlideLayout'
import { Flow, Node, Callout } from './components/Visuals'

const configurationSteps = [
  { title: 'Instalar e habilitar', detail: 'Docker e Compose' },
  {
    title: 'Gravar configurações',
    detail: 'Diretórios, Caddyfile, Compose e .env',
  },
  {
    title: 'Baixar e iniciar',
    detail: 'docker compose up -d --pull always',
  },
  { title: 'Verificar aplicação', detail: 'HTTP 200 em 127.0.0.1:8080' },
  {
    title: 'Recarregar Caddy',
    detail: 'Handler, se a configuração mudou',
  },
]

export default function Slide08() {
  return (
    <SlideLayout
      title="Ansible: preparação e verificação dos serviços"
      lead="O playbook prepara o Ubuntu e executa uma imagem já publicada. Ele não compila a aplicação no servidor."
      className="n2-dense-heading"
    >
      <div className="n2-two-column n2-runbook-layout">
        <Flow numbered className="n2-flow-vertical n2-flow-compact" items={configurationSteps} />
        <div className="n2-stack-explanation">
          <div className="n2-service-stack">
            <Node icon="browser" title="web" detail="Loopback 8080" />
            <Node icon="lock" title="caddy" detail="Público 80 / 443" accent />
            <Node icon="pulse" title="uptime-kuma" detail="Loopback 3001" />
          </div>
          <Callout label="Persistência e versão">
            Volumes preservam Kuma e Caddy. O .env existente mantém a imagem selecionada.
          </Callout>
          <p className="n2-fine-print">
            O teste local não valida HTTPS público. Uma reexecução pode baixar imagens ou recriar
            serviços.
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
