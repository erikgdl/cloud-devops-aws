const decisions = [
  {
    subject: 'Recursos',
    artifact: 'Definição Terraform',
    description: 'A EC2, o Elastic IP, as regras de acesso e as permissões IAM são descritos em código.',
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
      'Após o CI aprovado, o CD publica a imagem no GHCR e atualiza a EC2 via SSM. O Compose define a execução dos serviços.',
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
