import SlideLayout from './components/SlideLayout'
import {Node, Callout} from './components/Visuals'

export default function Slide10() {
    return <SlideLayout title="Containers e Docker Compose"
                        lead="Imagem é o artefato. Container é sua instância. Compose organiza a execução.">
        <div className="n2-compose-comparison">
            <div className="n2-compose-panel"><span className="n2-stage-label">Execução local</span><h2>Um serviço</h2>
                <code className="n2-file-path">docker-compose.yaml</code><Node icon="browser" title="web"
                                                                               detail="Imagem pronta, sem build no Compose"/>
                <p>O build é realizado separadamente.<br/><code>HTTP_PORT</code> escolhe a porta do host.</p></div>
            <div className="n2-compose-panel n2-compose-production"><span className="n2-stage-label">Servidor configurado pelo Ansible</span>
                <h2>Três serviços</h2><code className="n2-file-path">/opt/cloud-devops-aws/compose.yml</code>
                <div className="n2-service-row"><Node icon="browser" title="web"/><Node icon="lock" title="caddy"
                                                                                        accent/><Node icon="pulse"
                                                                                                      title="Kuma"/>
                </div>
                <p><code>127.0.0.1:8080:8080</code><br/>Volumes preservam os dados do Kuma e Caddy.</p></div>
        </div>
        <div className="n2-two-column n2-compose-notes"><Callout label="APP_IMAGE">Seleciona a imagem. O serviço se
            chama web; o Compose gera o nome do container.</Callout><Callout label="unless-stopped">Política de reinício
            que respeita paradas deliberadas.</Callout></div>
    </SlideLayout>
}
