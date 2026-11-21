import SlideLayout from './components/SlideLayout'
import {Flow, Callout} from './components/Visuals'
import Icon from './components/Icon'

export default function Slide03() {
    return <SlideLayout title="Aplicação utilizada no trabalho"
                        lead="A página apresenta o projeto e é o artefato que percorre o processo de entrega.">
        <div className="n2-two-column n2-app-layout">
            <div className="n2-browser-model">
                <div className="n2-browser-bar"><span aria-hidden="true">● ● ●</span><span>Cloud DevOps</span></div>
                <div className="n2-browser-page"><span>React + Vite</span><strong>Anatomia<br/>de um deploy.</strong>
                    <div className="n2-mini-structure" aria-hidden="true"><i/><i/><i/></div>
                </div>
                <div className="n2-browser-caption"><Icon name="browser"/>JavaScript executado no navegador</div>
            </div>
            <div className="n2-stack-explanation">
                <Flow className="n2-flow-vertical" items={[{
                    title: 'React',
                    detail: 'Interface organizada em componentes',
                    icon: 'container'
                }, {title: 'Vite', detail: 'Desenvolvimento e geração do build', icon: 'terminal'}, {
                    title: 'dist/',
                    detail: 'HTML, CSS, JavaScript e recursos',
                    icon: 'file'
                }, {title: 'Nginx', detail: 'Entrega do conteúdo ao navegador', icon: 'server'}]}/>
                <Callout label="Construção ≠ execução">Node.js participa do build. O Vite de desenvolvimento não atende
                    a produção.</Callout>
            </div>
        </div>
    </SlideLayout>
}
