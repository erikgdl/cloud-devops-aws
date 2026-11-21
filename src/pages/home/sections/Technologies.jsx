const technologies = [
  {
    role: 'Aplicação web',
    name: 'React, Vite e Nginx',
    note: 'React estrutura a interface, Vite gera os arquivos estáticos e Nginx os serve na porta 8080.',
  },
  {
    role: 'Infraestrutura',
    name: 'Terraform e AWS',
    note: 'O Terraform define EC2 Ubuntu, Elastic IP, Security Group e permissões IAM, utilizando a VPC padrão existente.',
  },
  {
    role: 'Automação',
    name: 'Ansible',
    note: 'O inventário identifica o host. O playbook instala Docker e Compose, configura o Caddy para HTTPS e inicia a aplicação e o Uptime Kuma.',
  },
  {
    role: 'Contêineres',
    name: 'Docker, Compose e GHCR',
    note: 'O GHCR armazena as imagens versionadas. O Compose define portas, volumes e execução dos contêineres.',
  },
  {
    role: 'Integração e entrega',
    name: 'GitHub Actions e SSM',
    note: 'O CI valida lint e builds. O CD publica no GHCR e atualiza a EC2 via SSM, com credenciais AWS temporárias por OIDC.',
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
