import SlideLayout from './components/SlideLayout'
import { Node, Tech } from './components/Visuals'

export default function Slide02() {
  return (
    <SlideLayout
      title="Arquitetura do ambiente"
      lead="O ambiente foi organizado em componentes com responsabilidades diferentes. Para compreender seu funcionamento,
                        acompanhamos tanto o acesso do usuário quanto as ferramentas utilizadas para preparar e atualizar o servidor."
    >
      <div className="n2-architecture">
        <div className="n2-access-route">
          <Node icon="browser" title="Usuário" detail="Navegador" />
          <Node icon="network" title="DNS" detail="Endereço público" />
          <Node icon="lock" title="Caddy" detail="Proxy e HTTPS" accent />
          <Node icon="server" title="Nginx / web" detail="Arquivos React" />
        </div>
        <div className="n2-host-boundary">
          <span>Servidor Ubuntu · containers na rede Docker</span>
          <span>Caddy encaminha · Nginx serve os arquivos</span>
        </div>
        <div className="n2-responsibilities">
          <div>
            <Tech name="terraform">Terraform</Tech>
            <p>Provisiona os recursos AWS.</p>
          </div>
          <div>
            <Tech name="ansible">Ansible</Tech>
            <p>Configura o host e os serviços.</p>
          </div>
          <div>
            <Tech name="actions">Actions + GHCR</Tech>
            <p>Valida, publica e implanta.</p>
          </div>
          <div>
            <strong>Uptime Kuma</strong>
            <p>Consulta os alvos cadastrados.</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
