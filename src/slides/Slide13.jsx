import SlideLayout from './components/SlideLayout'
import {Flow, Tech, Callout} from './components/Visuals'

export default function Slide13() {
    return <SlideLayout title="CI: integração contínua" lead="Verificações automáticas antes da publicação."
                        note="O CI aprovado confirma essas etapas. Não há testes funcionais ou de navegador configurados.">
        <div className="n2-ci-trigger"><Tech name="actions">GitHub Actions</Tech>
            <div><code>push → master</code><code>pull request → master</code></div>
        </div>
        <Flow numbered className="n2-flow-ci" items={[{title: 'Checkout', detail: 'Código da revisão', icon: 'git'}, {
            title: 'Node.js 22',
            detail: 'Ambiente e cache npm',
            icon: 'terminal'
        }, {title: 'npm ci', detail: 'Dependências do lockfile', icon: 'container'}, {
            title: 'Lint',
            detail: 'npm run lint --if-present',
            icon: 'search'
        }, {title: 'Build Vite', detail: 'npm run build', icon: 'file'}, {
            title: 'Build Docker',
            detail: 'Construção da imagem',
            icon: 'server'
        }]}/>
        <Callout label="Validação de construção">O script de lint existe. A imagem do CI não é publicada; o CD realiza
            outro build.</Callout>
    </SlideLayout>
}
