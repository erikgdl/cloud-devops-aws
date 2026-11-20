import github from '../../../assets/architecture/github.png'
import actions from '../../../assets/architecture/githubactions.svg'
import aws from '../../../assets/architecture/amazonwebservices.svg'
import terraform from '../../../assets/architecture/terraform.svg'
import ansible from '../../../assets/architecture/ansible.svg'
import ubuntu from '../../../assets/architecture/ubuntu.svg'
import docker from '../../../assets/architecture/docker.svg'
import './Architecture.css'
import ToolMark from '../../../components/ToolMark'

const imagePath = [
  {
    name: 'GitHub',
    logo: github,
    detail:
      'O repositório versiona a aplicação React. Cada revisão identifica o código usado no build.',
  },
  {
    name: 'GitHub Actions',
    logo: actions,
    detail: 'O workflow constrói a imagem da aplicação e a publica no registro.',
  },
  {
    name: 'Amazon ECR Public',
    logo: aws,
    detail: 'A imagem recebe um endereço público que o Docker usa para baixá-la.',
  },
]

const hostPath = [
  {
    name: 'Terraform',
    logo: terraform,
    detail: 'A configuração em código descreve a rede e a instância que a AWS provisiona.',
  },
  {
    name: 'Amazon EC2',
    logo: aws,
    detail: 'A instância fornece o host Ubuntu. Seu endereço entra no inventário do Ansible.',
  },
  {
    name: 'Ansible',
    logo: ansible,
    detail: 'O playbook prepara o Ubuntu, instala o Docker e o suporte ao Compose.',
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
          <Pathway title="Publicar a imagem" steps={imagePath} />
          <Pathway title="Preparar o host" steps={hostPath} />
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
              O Compose aponta para a imagem do ECR Public e define a porta do contêiner. No host
              configurado pelo Ansible, o Docker baixa a imagem e inicia a aplicação.
            </p>
          </div>
          <span className="http-output">
            <i aria-hidden="true" />
            Aplicação HTTP
          </span>
        </div>
      </div>
    </section>
  )
}
