import {
  actions,
  ansible,
  aws,
  docker,
  github,
  terraform,
  ubuntu,
} from '../../../assets/architecture/logos'
import ToolMark from '../../../components/ToolMark'
import './Architecture.css'

const imagePublishingSteps = [
  {
    name: 'GitHub',
    logo: github,
    detail:
      'O repositório versiona a aplicação React. Cada revisão identifica o código usado no build.',
  },
  {
    name: 'GitHub Actions',
    logo: actions,
    detail: 'O CI valida o código. O CD publica a imagem no GHCR e atualiza a EC2 por SSM.',
  },
  {
    name: 'GitHub Container Registry',
    logo: github,
    detail: 'O registro do GitHub armazena a imagem com tags latest e SHA do commit.',
  },
]

const hostPreparationSteps = [
  {
    name: 'Terraform',
    logo: terraform,
    detail: 'Descreve EC2, Elastic IP, Security Group e permissões IAM, reutilizando a VPC padrão.',
  },
  {
    name: 'Amazon EC2',
    logo: aws,
    detail: 'A instância fornece o host Ubuntu. Seu endereço entra no inventário do Ansible.',
  },
  {
    name: 'Ansible',
    logo: ansible,
    detail: 'O playbook instala Docker e Compose e configura aplicação, Caddy e Uptime Kuma.',
  },
]

function Pathway({ title, steps }) {
  return (
    <div className="architecture-path">
      <h3 data-reveal>{title}</h3>
      <ol>
        {steps.map(({ name, logo, detail }) => (
          <li key={name} data-reveal>
            <ToolMark logo={logo} />
            <div>
              <strong>{name}</strong>
              <p>{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Architecture() {
  return (
    <section className="map-section" id="arquitetura" aria-labelledby="map-heading">
      <div className="wrap">
        <div className="map-intro" data-reveal>
          <p className="caption">03 / Arquitetura</p>
          <h2 id="map-heading">A imagem e o destino.</h2>
          <p>Um fluxo publica a aplicação. O outro prepara a máquina que vai executá-la.</p>
        </div>
        <div className="architecture-paths">
          <Pathway title="Publicar a imagem" steps={imagePublishingSteps} />
          <Pathway title="Preparar o host" steps={hostPreparationSteps} />
        </div>
        <div className="runtime" data-reveal>
          <span className="runtime-marks" aria-hidden="true">
            <ToolMark logo={docker} size={48} />
            <ToolMark logo={ubuntu} size={20} />
          </span>
          <div>
            <small>Execução no Ubuntu</small>
            <h3>Docker Compose</h3>
            <p>
              No servidor, o Compose executa web, Caddy e Uptime Kuma. A imagem vem do GHCR; o Caddy
              recebe HTTPS e encaminha por HTTP ao Nginx na porta 8080.
            </p>
          </div>
          <span className="http-output">
            <i aria-hidden="true" />
            Aplicação HTTPS
          </span>
        </div>
      </div>
    </section>
  )
}
