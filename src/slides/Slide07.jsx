import SlideLayout from './components/SlideLayout'
import {Node, Tech, CodeBlock} from './components/Visuals'

export default function Slide07() {
    return <SlideLayout title="Ansible: configuração automatizada"
                        lead="A máquina provisionada recebe os programas e as configurações da solução.">
        <div className="n2-two-column n2-ansible-layout">
            <div className="n2-control-path"><Tech name="ansible" size={36}>Controlador Ansible</Tech><Node icon="file"
                                                                                                            title="Inventário"
                                                                                                            detail="Host, usuário e conexão"/><span
                className="n2-connection-label">SSH + sudo</span><Node icon="server" title="Servidor Ubuntu"
                                                                       detail="Docker e serviços configurados" accent/>
            </div>
            <div className="n2-stack-explanation"><CodeBlock label="Variáveis do playbook"
                                                             lines={['app_dir      → diretório', 'app_image    → imagem publicada', 'app_domain   → aplicação', 'monitor_domain → monitoramento']}/>
                <div className="n2-generated-files"><h2>Arquivos gerados</h2>
                    <code>compose.yml</code><code>caddy/Caddyfile</code><code>.env inicial</code></div>
                <p className="n2-division"><b>Terraform</b> provisiona.<br/><b>Ansible</b> configura o sistema e os
                    serviços.</p></div>
        </div>
    </SlideLayout>
}
