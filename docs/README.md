# Documentação técnica

Esta documentação descreve os arquivos versionados do Cloud DevOps e os procedimentos derivados deles.
O código e as configurações são a fonte de verdade; disponibilidade pública e sucesso de implantações precisam de verificação no ambiente.

## Percursos de leitura

- **Conhecer ou apresentar:** [visão geral](../README.md) → [arquitetura](arquitetura.md) → [CI/CD](ci-cd.md).
- **Desenvolver localmente:** [desenvolvimento e Docker](desenvolvimento.md) → [direção visual](design-direction.md).
- **Reproduzir a implantação:** [infraestrutura](infraestrutura.md) → [automação](automacao.md) → [implantação](implantacao.md).
- **Administrar o servidor:** [operação e segurança](operacao-e-seguranca.md).

## Documentos e fontes principais

| Documento | Finalidade | Fontes do repositório |
| --- | --- | --- |
| [Arquitetura](arquitetura.md) | Explicar responsabilidades, comunicação e limites | [Dockerfile](../Dockerfile), [playbook](../ansible/playbook.yml), [Terraform](../terraform/), [workflows](../.github/workflows/) |
| [Infraestrutura](infraestrutura.md) | Referenciar recursos e requisitos do provisionamento | [terraform/](../terraform/) |
| [Automação](automacao.md) | Referenciar inventário, variáveis e tarefas | [ansible/](../ansible/) |
| [Desenvolvimento](desenvolvimento.md) | Executar, verificar e modificar o frontend | [package.json](../package.json), [src/](../src/), [Compose local](../docker-compose.yaml) |
| [Implantação](implantacao.md) | Preparar e implantar em um ambiente compatível | [modelo de variáveis](../terraform/terraform.tfvars.example), [modelo de inventário](../ansible/inventory.ini.example), [playbook](../ansible/playbook.yml) |
| [CI/CD](ci-cd.md) | Referenciar gatilhos, permissões e atualização remota | [ci.yml](../.github/workflows/ci.yml), [cd.yml](../.github/workflows/cd.yml), [oidc.tf](../terraform/oidc.tf) |
| [Operação e segurança](operacao-e-seguranca.md) | Validar serviços, investigar falhas e administrar acessos | [playbook](../ansible/playbook.yml), [Nginx](../nginx.conf), [SSM](../terraform/ssm.tf) |
| [Direção visual](design-direction.md) | Explicar a organização visual do site | [estilos](../src/styles/), [seções](../src/pages/home/sections/) |

## Como interpretar os exemplos

- Comandos com variáveis de shell, `read`, heredoc ou `\` pressupõem **Bash em Linux/WSL**.
  A aplicação e o Docker local também podem ser utilizados em outros sistemas, com a sintaxe de shell correspondente.
- Os comandos partem da raiz do repositório, salvo indicação de execução no servidor.
- Endereços como `192.0.2.10`, domínios `example.org` e campos indicados para substituição são exemplos.
  Não representam credenciais ou um ambiente disponível para testes.
- Caminhos sob `/opt/cloud-devops-aws` são criados no host pelo Ansible; não são arquivos ausentes do clone.
- Inventário real, variáveis locais e credenciais não são requisitos já preenchidos por um clone do repositório.
- Os procedimentos documentados não representam execução de infraestrutura durante a revisão da documentação.

## Estado e limites conhecidos

A aplicação é um site estático; não há backend de negócio, banco de dados da aplicação ou cluster de contêineres.
O Uptime Kuma mantém seus próprios dados em volume.
Não há provisionamento de DNS, cadastro automatizado de monitores, rotina de backup ou rollback automático.

A interface ainda contém referências a ECR Public, mas o pipeline atual publica no **GHCR**.
As demais diferenças e pontos para revisão estão consolidados em [Operação e segurança](operacao-e-seguranca.md#pontos-para-revisão-técnica).
