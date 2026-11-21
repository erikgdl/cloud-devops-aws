import SlideLayout from './components/SlideLayout'
import {Flow, CodeBlock} from './components/Visuals'

export default function Slide14() {
    return <SlideLayout title="CD: publicação e implantação"
                        lead="O CI bem-sucedido de um push na master do próprio repositório autoriza a entrega."
                        note="Host já configurado e identificadores AWS fixos. Sem rollback automático ou validação externa do HTTPS.">
        <div className="n2-cd-lanes">
            <div className="n2-cd-publish"><span className="n2-stage-label">Primeiro · publicar</span><Flow
                items={[{title: 'Commit aprovado', detail: 'SHA do CI', icon: 'git'}, {
                    title: 'Build + GHCR',
                    detail: 'Imagem publicada',
                    icon: 'container'
                }]}/>
                <div className="n2-image-tags"><code>:latest</code><code>:SHA do commit</code></div>
            </div>
            <div className="n2-cd-deploy"><span className="n2-stage-label">Depois · implantar</span><Flow
                items={[{title: 'OIDC', detail: 'Credenciais temporárias', icon: 'lock'}, {
                    title: 'SSM',
                    detail: 'Comando remoto',
                    icon: 'terminal'
                }, {title: 'EC2', detail: 'Atualização da stack', icon: 'server'}]}/></div>
        </div>
        <CodeBlock label="No servidor · ordem do procedimento"
                   lines={['docker pull imagem:SHA  →  .env com APP_IMAGE', 'docker compose up -d --pull never', 'curl no HTTP local  →  espera do resultado SSM']}/>
    </SlideLayout>
}
