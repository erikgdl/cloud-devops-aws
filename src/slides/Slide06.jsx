import SlideLayout from './components/SlideLayout'
import { Flow, Tech, Callout } from './components/Visuals'
import Icon from './components/Icon'

const provisioningSteps = [
  { title: 'Inicializar', detail: 'Providers e backend' },
  {
    title: 'Validar',
    detail: 'Configuração',
  },
  { title: 'Planejar', detail: 'Mudanças propostas' },
  {
    title: 'Revisar',
    detail: 'Decisão do operador',
  },
  { title: 'Aplicar', detail: 'Plano aprovado' },
]

export default function Slide06() {
  return (
    <SlideLayout
      title="Terraform: infraestrutura como código"
      lead="Utilizamos Terraform para descrever os recursos de infraestrutura em arquivos versionados. Essa abordagem permite revisar as configurações e analisar as alterações antes de aplicá-las."
      note="Dependências externas: bucket S3, provedor IAM OIDC, VPC/sub-redes padrão, DNS e SSM Agent funcional."
    >
      <Flow numbered items={provisioningSteps} />
      <div className="n2-two-column n2-terraform-bottom">
        <div className="n2-resource-ledger">
          <Tech name="terraform">Recursos definidos</Tech>
          <div>
            <span>EC2 + Elastic IP</span>
            <span>Security Group</span>
            <span>Chave pública SSH</span>
            <span>IAM / SSM / Actions</span>
            <span>Variáveis e outputs</span>
          </div>
        </div>
        <Callout
          className="n2-state-callout"
          label={
            <>
              <Icon name="storage" /> State no S3
            </>
          }
        >
          Relaciona a configuração aos recursos gerenciados. Criptografia e locking por lockfile.
        </Callout>
      </div>
    </SlideLayout>
  )
}
