const technologies = [
  {
    role: 'Aplicação web',
    name: 'React e Vite',
    note: 'Os componentes React estruturam a interface. O Vite transforma o código em arquivos estáticos para distribuição.',
  },
  {
    role: 'Infraestrutura',
    name: 'Terraform e EC2',
    note: 'O Terraform descreve os recursos na AWS. A EC2 fornece a máquina virtual com Ubuntu.',
  },
  {
    role: 'Automação',
    name: 'Ansible',
    note: 'O inventário seleciona as máquinas. O playbook registra as tarefas de instalação e configuração comuns a elas.',
  },
  {
    role: 'Contêineres',
    name: 'Docker, Compose e ECR Public',
    note: 'O registro armazena a imagem, o Compose define a execução e o Docker inicia o contêiner.',
  },
  {
    role: 'Integração e entrega',
    name: 'GitHub e GitHub Actions',
    note: 'O repositório reúne o código. Ao workflow cabe transformar uma revisão da aplicação em uma imagem publicável.',
  },
]

export default function Technologies() {
  return (
    <section className="catalog" id="tecnologias">
      <div className="catalog-inner wrap">
        <div data-reveal>
          <p className="caption">04 / Tecnologias</p>
          <h2>Divisão de responsabilidades</h2>
        </div>
        <dl className="entries">
          {technologies.map(({ role, name, note }) => (
            <div key={role} data-reveal>
              <dt>
                <small>{role}</small>
                {name}
              </dt>
              <dd>{note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
