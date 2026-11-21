import SlideLayout from './components/SlideLayout'
import Icon from './components/Icon'

export default function Slide18() {
  return (
    <SlideLayout
      title="Resultados, limitações e aprendizados"
      lead="O trabalho permitiu estudar a conexão entre desenvolvimento, infraestrutura e operação.
                         Os arquivos versionados registram como construir a aplicação, preparar o servidor e executar o processo de entrega."
      className="n2-closing"
    >
      <div className="n2-closing-layout">
        <div className="n2-closing-statement">
          <span className="n2-stencil" aria-hidden="true">
            N2
          </span>
          <strong>
            Compreender
            <br />o ambiente.
            <br />
            Defender
            <br />
            as decisões.
          </strong>
          <p>Investigar falhas com base em evidências.</p>
        </div>
        <div className="n2-closing-lists">
          <div>
            <h2>
              <Icon name="check" />
              Implementado
            </h2>
            <ul>
              <li>React/Vite e Docker multi-stage.</li>
              <li>Infraestrutura com Terraform.</li>
              <li>Ansible, Caddy e HTTPS.</li>
              <li>GHCR após CI e deploy por SSM.</li>
              <li>Kuma com volume persistente.</li>
            </ul>
          </div>
          <div>
            <h2>
              <Icon name="search" />
              Próximos cuidados
            </h2>
            <ul>
              <li>Preparação das dependências externas.</li>
              <li>Aplicação e monitor no mesmo host.</li>
              <li>Backup e restauração a definir e testar.</li>
              <li>Ampliar verificações e testes do CI.</li>
            </ul>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
