import SlideLayout from './components/SlideLayout'
import {Tech, DataTable, Callout} from './components/Visuals'
import Icon from './components/Icon'

export default function Slide04() {
    return <SlideLayout title="Infraestrutura em nuvem: AWS"
                        lead="Execução, permissões e implantação remota têm responsabilidades distintas.">
        <div className="n2-two-column n2-aws-layout">
            <div className="n2-machine-panel"><Tech name="aws" size={44}>Amazon EC2</Tech><Icon name="server"
                                                                                                className="n2-server-emblem"/><strong>O
                host da solução</strong><p>Aplicação, proxy e monitoramento no mesmo servidor.</p>
                <div className="n2-specs"><span><b>24.04</b>Ubuntu Server</span><span><b>t3.small</b>Instância prevista</span><span><b>30 GiB</b>gp3 criptografado</span>
                </div>
            </div>
            <div className="n2-stack-explanation"><DataTable headers={['Recurso', 'Responsabilidade']}
                                                             rows={[['Elastic IP', 'Endereço público associado ao host'], ['IAM', 'Permissões EC2 e Actions / OIDC'], ['SSM', 'Comandos remotos de deploy'], ['S3', 'State em bucket já existente']]}/><Callout
                label="Registro de imagens">GHCR é o registro do GitHub, fora da AWS.</Callout></div>
        </div>
    </SlideLayout>
}
