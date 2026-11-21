import SlideLayout from './components/SlideLayout'
import { DataTable, Flow } from './components/Visuals'

const diagnosisSteps = [
  { title: 'Observar' },
  { title: 'Reunir evidências' },
  { title: 'Formular hipótese' },
  { title: 'Corrigir' },
  { title: 'Validar' },
]

const diagnosisRows = [
  ['Domínio não resolve', 'DNS e endereço esperado'],
  ['Erro HTTPS', 'Domínio, certificado e Caddy'],
  ['Resposta 502', 'Proxy e disponibilidade do serviço interno'],
  ['Container parado / reiniciando', 'Estado, logs e código de saída'],
  ['Lentidão / falta de espaço', 'CPU, memória, disco e inodes'],
  ['Falha no deploy', 'Actions, SSM, imagem e Compose'],
]

export default function Slide17() {
  return (
    <SlideLayout
      title="Investigação de falhas e recuperação"
      lead="A investigação deve começar pelo sintoma observado e avançar pelas camadas do ambiente. Cada verificação deve ajudar a confirmar ou descartar uma hipótese antes da correção."
    >
      <div className="n2-diagnosis-layout">
        <Flow numbered className="n2-flow-compact" items={diagnosisSteps} />
        <DataTable headers={['Sintoma observado', 'Camada e evidências']} rows={diagnosisRows} />
      </div>
    </SlideLayout>
  )
}
