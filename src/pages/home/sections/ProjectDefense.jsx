import PresentationButton from '../../../components/PresentationButton'

export default function ProjectDefense() {
  return (
    <section className="n2" id="apresentacao">
      <div className="wrap n2-inner" data-reveal>
        <div className="print-mark" aria-hidden="true">
          N2
        </div>
        <div>
          <p className="caption">Cloud DevOps / Defesa acadêmica</p>
          <h2>A defesa do projeto</h2>
          <p>
            A defesa reúne a questão do trabalho, as decisões de arquitetura e a comparação entre os
            ambientes de execução.
          </p>
          <PresentationButton arrow="↗">Abrir apresentação</PresentationButton>
        </div>
      </div>
    </section>
  )
}
