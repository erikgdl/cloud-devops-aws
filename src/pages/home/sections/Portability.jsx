import ToolMark from '../../../components/ToolMark'
import ansible from '../../../assets/architecture/ansible.svg'
import aws from '../../../assets/architecture/amazonwebservices.svg'
import ubuntu from '../../../assets/architecture/ubuntu.svg'
import docker from '../../../assets/architecture/docker.svg'
import terraform from '../../../assets/architecture/terraform.svg'
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
            dois ambientes Ubuntu.
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
                <ToolMark logo={terraform} size={18} /> O Terraform define a instância. O inventário
                usa o endereço do servidor na AWS.
              </dd>
            </div>
            <div data-reveal>
              <dt>
                <ToolMark logo={ubuntu} />
                Máquina física
              </dt>
              <dd>
                O inventário usa o endereço local do computador com Ubuntu. O playbook aplica as
                mesmas tarefas.
              </dd>
            </div>
          </dl>
        </div>
        <div className="port-runtime" data-reveal>
          <ToolMark logo={docker} />
          <div>
            <h3>A mesma imagem Docker</h3>
            <p>
              Nos dois destinos, o Docker baixa a imagem do Amazon ECR Public sem credenciais AWS. O
              Compose define como executar a aplicação.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
