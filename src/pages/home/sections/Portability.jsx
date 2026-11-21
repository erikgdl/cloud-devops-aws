import { ansible, aws, ubuntu, docker, terraform } from '../../../assets/architecture/logos'
import ToolMark from '../../../components/ToolMark'
import './portability.css'

export default function Portability() {
  return (
    <section className="port" id="portabilidade" aria-labelledby="port-heading">
      <div className="wrap">
        <div data-reveal>
          <p className="caption">05 / Portabilidade do deploy</p>
          <h2 id="port-heading">
            Um playbook para
            <br />
            outro host Ubuntu.
          </h2>
        </div>
        <div className="port-route">
          <div className="port-source" data-reveal>
            <ToolMark logo={ansible} />
            <div>
              <small>Inventário de hosts</small>
              <strong>Playbook Ansible</strong>
            </div>
          </div>
          <dl className="destinations">
            <div data-reveal>
              <dt>
                <ToolMark logo={aws} />
                Ubuntu na EC2
              </dt>
              <dd>
                <ToolMark logo={terraform} size={18} /> O Terraform cria a EC2 na VPC padrão
                existente. O IP do servidor é preenchido manualmente no inventário.
              </dd>
            </div>
            <div data-reveal>
              <dt>
                <ToolMark logo={ubuntu} />
                Ubuntu compatível
              </dt>
              <dd>
                O playbook pode configurar outro Ubuntu com APT, systemd, Python, SSH e sudo. A
                compatibilidade precisa ser verificada.
              </dd>
            </div>
          </dl>
        </div>
        <div className="port-runtime" data-reveal>
          <ToolMark logo={docker} />
          <div>
            <h3>A mesma imagem Docker</h3>
            <p>
              A reutilização exige Ubuntu e arquitetura compatíveis, além de acesso à imagem no
              GHCR. O Terraform e o CD por SSM continuam específicos da AWS.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
