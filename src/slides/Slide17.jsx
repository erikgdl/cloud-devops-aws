import SlideLayout from './components/SlideLayout'
import {DataTable, Flow} from './components/Visuals'

export default function Slide17() {
    return <SlideLayout title="Investigação de falhas e recuperação"
                        lead="Reunir evidências e testar hipóteses antes de alterar o ambiente."
                        note="Após corrigir: conferir serviço local, acesso público e monitoramento. Explicar causa, alteração e evidência de recuperação.">
        <div className="n2-diagnosis-layout"><Flow numbered className="n2-flow-compact"
                                                   items={[{title: 'Observar'}, {title: 'Reunir evidências'}, {title: 'Formular hipótese'}, {title: 'Corrigir'}, {title: 'Validar'}]}/><DataTable
            headers={['Sintoma observado', 'Camada e evidências']}
            rows={[['Domínio não resolve', 'DNS e endereço esperado'], ['Erro HTTPS', 'Domínio, certificado e Caddy'], ['Resposta 502', 'Proxy e disponibilidade do serviço interno'], ['Container parado / reiniciando', 'Estado, logs e código de saída'], ['Lentidão / falta de espaço', 'CPU, memória, disco e inodes'], ['Falha no deploy', 'Actions, SSM, imagem e Compose']]}/>
        </div>
    </SlideLayout>
}
