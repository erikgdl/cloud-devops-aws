import SlideLayout from './components/SlideLayout'
import {Tech} from './components/Visuals'
import Icon from './components/Icon'

export default function Slide01() {
    return <SlideLayout title="Cloud DevOps" eyebrow="Projeto Integrador · N2"
                        lead="Aplicação de práticas DevOps em um ambiente de nuvem." className="n2-cover">
        <div className="n2-cover-copy">
            <p>Do código à aplicação.<br/>Da infraestrutura à operação.</p>
            <div className="n2-cover-tools"><Tech name="terraform">Terraform</Tech><Tech
                name="ansible">Ansible</Tech><Tech name="docker">Docker</Tech></div>
            <p className="n2-cover-context">Infraestrutura como código, configuração automatizada, entrega contínua e
                monitoramento.</p>
        </div>
        <div className="n2-cover-diagram" role="img" aria-label="Código no GitHub, imagem no GHCR e execução em servidor Ubuntu">
            <svg viewBox="0 0 520 380" fill="none" aria-hidden="true">
                <defs>
                    <pattern id="n2-cover-grid" width="40" height="24" patternUnits="userSpaceOnUse">
                        <path d="M0 0 40 24M0 24 40 0" stroke="currentColor" strokeWidth=".6"/>
                    </pattern>
                </defs>
                <path d="m20 210 220-126 260 147-220 126Z" fill="url(#n2-cover-grid)" opacity=".3"/>
                <path d="m103 171 92 52 99-56 93 53" className="n2-wire"/>
                <path d="m103 171 92 52 99-56 93 53" className="n2-packet" pathLength="100"/>
                <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="m45 116 66-38 66 38-66 38Z" fill="var(--blue-face)"/>
                    <path d="m45 116 66 38v60l-66-38Z" fill="var(--night)"/>
                    <path d="m111 154 66-38v60l-66 38Z" fill="var(--rack-side)"/>
                    <path d="m285 171 90-52 90 52-90 52Z" fill="var(--blue-face)"/>
                    <path d="m285 171 90 52v86l-90-52Z" fill="var(--night)"/>
                    <path d="m375 223 90-52v86l-90 52Z" fill="var(--rack-side)"/>
                    <path d="m300 196 58 33m-58-11 58 33m-58-11 58 33"/>
                    <path d="m402 223 42-24m-42 45 42-24m-42 45 42-24"/>
                    <path d="m91 118 12 8 26-15m191 82 8 4m-8 18 8 4m-8 18 8 4" stroke="var(--acid)" strokeWidth="3"/>
                </g>
                <path d="M61 76V47h51M405 116V69h55" stroke="currentColor"/>
                <g fill="var(--paper)" stroke="none" fontSize="17" fontFamily="var(--mono)">
                    <text x="44" y="35">GHCR</text>
                    <text x="340" y="56">Ubuntu / EC2</text>
                </g>
            </svg>
            <div className="n2-cover-route"><span><Icon name="git"/>Código</span><span><Icon
                name="container"/>Imagem</span><span><Icon name="server"/>Execução</span></div>
        </div>
    </SlideLayout>
}
