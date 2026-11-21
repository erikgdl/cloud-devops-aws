# Infraestrutura e Terraform

Este documento referencia os recursos AWS descritos em [terraform/](../terraform/), seus parâmetros e suas dependências externas.
O procedimento para preparar credenciais, revisar um plano e provisionar está em [Implantação](implantacao.md).

## Versões e arquivos

[providers.tf](../terraform/providers.tf) exige Terraform `>= 1.10.0` e o provider `hashicorp/aws` com restrição `~> 6.0`.
O [lockfile](../terraform/.terraform.lock.hcl) seleciona a versão `6.73.0` do provider e registra seus hashes.

| Arquivo | Responsabilidade |
| --- | --- |
| [backend.tf](../terraform/backend.tf) | Estado remoto S3, criptografia e bloqueio por lockfile |
| [providers.tf](../terraform/providers.tf) | Versões, região AWS e perfil local |
| [variables.tf](../terraform/variables.tf) | Parâmetros e validação do CIDR SSH |
| [main.tf](../terraform/main.tf) | Consultas de rede e AMI; EC2, disco, Security Group, chave e Elastic IP |
| [ssm.tf](../terraform/ssm.tf) | Role da EC2, policy SSM e instance profile |
| [oidc.tf](../terraform/oidc.tf) | Role e policy utilizadas pelo GitHub Actions |
| [outputs.tf](../terraform/outputs.tf) | Endereço público, ID da instância e comando SSH |
| [terraform.tfvars.example](../terraform/terraform.tfvars.example) | Modelo para os parâmetros locais |

## Recursos efetivamente gerenciados

| Recurso | Configuração observável |
| --- | --- |
| EC2 | Uma instância; tipo padrão `t3.small` |
| Sistema | AMI oficial Canonical Ubuntu Server 24.04, arquitetura `amd64`, virtualização HVM |
| Disco raiz | EBS `gp3`, 30 GiB, criptografado |
| Metadata | IMDSv2 obrigatório por `http_tokens = "required"` |
| Endereço | Elastic IP associado à instância |
| Security Group | Grupo exclusivo do projeto, associado à VPC padrão |
| SSH | Registro de uma chave pública existente no computador do operador |
| SSM | Role de serviço EC2 com `AmazonSSMManagedInstanceCore` e instance profile |
| GitHub Actions | Role assumida por OIDC e policy para atualização por SSM |

Os nomes e tags utilizam `project_name`.
Não há Auto Scaling, balanceador, cluster, banco de dados ou outra instância de aplicação definida.

## Rede e regras de acesso

O código consulta a **VPC padrão já existente** e suas subnets.
A instância utiliza `sort(data.aws_subnets.default.ids)[0]`.
Essa seleção ordena IDs; não verifica se a subnet tem a conectividade adequada.

VPC, subnets, Internet Gateway e tabelas de rotas não são criados pelo projeto.
Uma conta sem VPC padrão ou com rotas modificadas exige preparação externa antes do provisionamento.
O Elastic IP não substitui as rotas necessárias à comunicação com a internet.

| Direção | Protocolo/porta | Origem ou destino |
| --- | --- | --- |
| Entrada | TCP `80` | IPv4 público, para HTTP e uso do Caddy |
| Entrada | TCP `443` | IPv4 público, para HTTPS |
| Entrada | TCP `22` | Somente o CIDR em `ssh_allowed_cidr` |
| Saída | Todos os protocolos | IPv4 `0.0.0.0/0` |

As portas `8080` e `3001` não possuem regras públicas no Security Group.
O acesso público ao Kuma ocorre pelo proxy HTTPS em `443`, conforme o playbook.
Não há regras de entrada IPv6 nem liberação UDP `443` nessa configuração.
DNS e firewall do sistema operacional não são gerenciados pelo Terraform.

## Variáveis de entrada

| Variável | Tipo | Padrão | Efeito |
| --- | --- | --- | --- |
| `aws_region` | `string` | `us-east-1` | Região do provider e de referências na policy de deploy |
| `project_name` | `string` | `cloud-devops-aws` | Prefixo de nomes e tags |
| `instance_type` | `string` | `t3.small` | Tipo da EC2 |
| `ssh_allowed_cidr` | `string` | Sem padrão | CIDR IPv4 com permissão de SSH |

A validação de `ssh_allowed_cidr` verifica um CIDR IPv4 e rejeita especificamente `0.0.0.0/0`.
Ela não exige `/32` nem impede outros intervalos amplos.
O endereço `203.0.113.10/32` do modelo é ilustrativo e precisa ser substituído pelo endereço de saída autorizado.

O tipo de instância precisa ser compatível com a AMI `amd64` selecionada.
A configuração não troca a AMI automaticamente para ARM ao alterar `instance_type`.

## Estado remoto e credenciais

O backend S3 contém um bucket específico do ambiente original, uma chave de estado e uma região fixa.
O perfil local `devops-terraform` aparece tanto no backend quanto no provider.
Essas opções não são variáveis de [variables.tf](../terraform/variables.tf).

O bucket precisa existir antes de `terraform init`.
Não há recurso Terraform neste repositório que o crie ou configure seu versionamento e controle de acesso.
O backend solicita criptografia com `encrypt = true` e bloqueio S3 com `use_lockfile = true`.
Não há tabela DynamoDB definida para bloqueio.

O operador precisa de acesso ao estado e ao objeto de lock, além das permissões necessárias às consultas e aos recursos AWS.
Não existe uma policy de bootstrap do operador versionada no projeto.
A policy da role de CD não concede permissões para executar o provisionamento Terraform.

Em outra conta, o [guia de implantação](implantacao.md#provisionar-na-aws) utiliza opções `-backend-config` para selecionar um bucket próprio.
Isso não altera os arquivos `.tf` nem provisiona esse bucket.
Alterar `aws_region` não modifica a região do backend automaticamente.

Estado, planos salvos e o cache `.terraform/` podem conter informações de ambiente.
O `.gitignore` exclui estado, cache e `*.tfvars`, mas não exclui genericamente arquivos `*.tfplan`.
Os exemplos de implantação salvam o plano fora do repositório.

## Chave SSH e dependências prévias

O recurso `aws_key_pair.devops` lê `~/.ssh/cloud-devops-aws-nova.pub`.
A chave pública deve existir nesse caminho na máquina que executa o Terraform.
O Terraform não cria nem distribui a chave privada correspondente.
O output SSH pressupõe essa chave privada em `~/.ssh/cloud-devops-aws-nova` e o usuário `ubuntu`.

O estado também depende de um provedor IAM OIDC para `token.actions.githubusercontent.com`, previamente cadastrado na conta AWS.
[oidc.tf](../terraform/oidc.tf) referencia esse provedor, mas não o cria.
A trust policy fixa audiência e um subject associado à identidade do repositório original e à branch `master`.
Um fork precisa revisar essa associação; trocar apenas o inventário não adapta a autenticação do CD.

## Integração SSM

[ssm.tf](../terraform/ssm.tf) permite que a EC2 assuma uma role com as permissões do SSM Agent.
A role do GitHub pode enviar `AWS-RunShellScript` somente para a instância descrita por esse Terraform.
A leitura do resultado usa `ssm:GetCommandInvocation`, com condição de região.

O projeto não contém uma tarefa de instalação ou ativação do SSM Agent.
Um agente funcional, registrado e com conectividade aos endpoints AWS continua sendo pré-requisito do CD.
O provisionamento da role não comprova que a instância já aparece como gerenciada no SSM.

## Outputs e mudanças que exigem revisão

| Output | Conteúdo |
| --- | --- |
| `ec2_public_ip` | Elastic IP da aplicação |
| `ec2_instance_id` | ID da EC2 |
| `ssh_command` | Comando de acesso com usuário e chave previstos |

A consulta da AMI utiliza `most_recent = true`.
Uma nova AMI encontrada pode levar o plano a propor substituição da instância.
Por isso, o plano não deve ser presumido como uma alteração pequena, mesmo ao executar novamente o mesmo código.

Não há rotina de backup ou recuperação dos volumes de serviço definida pelo Terraform.
Provisionar ou manter EC2, EBS, Elastic IP e armazenamento de estado pode gerar cobrança; não há cálculo de custos no repositório.

## Documentos relacionados

- [Arquitetura](arquitetura.md): relação entre infraestrutura, configuração e entrega.
- [Implantação](implantacao.md): preparação e revisão de plano.
- [CI/CD](ci-cd.md): dependências específicas do workflow de deploy.
- [Operação e segurança](operacao-e-seguranca.md): credenciais, persistência e diagnóstico.
