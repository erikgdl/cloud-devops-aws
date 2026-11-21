import SlideLayout from './components/SlideLayout'
import {Node} from './components/Visuals'

export default function Slide11() {
    return <SlideLayout title="DNS e reverse proxy"
                        lead="O DNS encontra o endereço. O Caddy seleciona o serviço pelo domínio."
                        note="DNS é administrado fora do Terraform. Resolução correta não comprova que a aplicação está disponível.">
        <div className="n2-domain-map">
            <div className="n2-domain-inputs">
                <div><span>Aplicação</span><code>devops.erikgdl.xyz</code></div>
                <div><span>Monitoramento</span><code>monitor.erikgdl.xyz</code></div>
                <p>Domínios padrão do playbook</p></div>
            <div className="n2-dns-resolver"><Node icon="network" title="DNS" detail="IP do servidor"/><span
                className="n2-connection-label">Requisição pelo nome</span><Node icon="lock" title="Caddy"
                                                                                 detail="Container de proxy" accent/>
            </div>
            <div className="n2-domain-targets"><Node icon="browser" title="web:8080" detail="Nginx / aplicação"/><span
                className="n2-network-caption">Rede Docker</span><Node icon="pulse" title="uptime-kuma:3001"
                                                                       detail="Monitoramento"/></div>
        </div>
    </SlideLayout>
}
