const decisions = [
  {
    subject: 'Recursos',
    artifact: 'Definição Terraform',
    description: 'A rede e a instância EC2 ficam descritas como recursos da infraestrutura.',
  },
  {
    subject: 'Ambiente',
    artifact: 'Playbook Ansible',
    description:
      'O inventário identifica o host. As tarefas definem como preparar o Ubuntu para executar contêineres.',
  },
  {
    subject: 'Aplicação',
    artifact: 'Imagem e Compose',
    description:
      'O GitHub Actions constrói a imagem para publicação no ECR Public. A definição Compose descreve como executá-la no Ubuntu.',
  },
]

export default function Solution() {
  return (
    <section className="solution" id="solucao">
      <div className="wrap">
        <div data-reveal>
          <p className="caption">02 / Solução adotada</p>
          <h2>O que o código descreve</h2>
        </div>
        <dl className="decisions">
          {decisions.map(({ subject, artifact, description }) => (
            <div key={subject} data-reveal>
              <dt>{subject}</dt>
              <dd>
                <strong>{artifact}</strong>
                <p>{description}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
