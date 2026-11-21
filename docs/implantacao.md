# Reproduzir a implantação

Este guia descreve a preparação e a implantação manual a partir dos arquivos do repositório.
Utilize Bash em Linux/WSL como controlador e execute os comandos na raiz do clone, salvo indicação contrária.
As etapas de aplicação Terraform e Ansible alteram o ambiente de destino e exigem revisão pelo operador.

## Escolher o caminho

| Objetivo | Caminho |
| --- | --- |
| Executar o site localmente | [Desenvolvimento e Docker](desenvolvimento.md) |
| Criar uma EC2 com o Terraform | Preparação e [provisionamento AWS](#provisionar-na-aws), depois Ansible |
| Utilizar Ubuntu em outra nuvem, VM ou máquina física | Preparação e [configuração Ansible](#configurar-o-host-com-ansible) |

O Terraform é específico da AWS.
O playbook configura um host existente e não o prepara automaticamente para receber o CD por SSM.
Para um host fora da AWS, o caminho deste guia é manual por Ansible, sem o CD AWS.

## Preparar requisitos comuns

Antes de configurar o servidor, tenha:

- Um controlador com Ansible, OpenSSH e acesso ao repositório.
- Um host Ubuntu com Python, APT, systemd e acesso administrativo por `become`.
- Repositórios com `docker.io` e `docker-compose-v2`; Ubuntu 24.04 `amd64` é a referência do projeto.
- SSH funcional, chave correspondente e identidade do servidor conferida.
- Portas livres para a stack: `80`, `443`, loopback `8080` e loopback `3001`.
- Saída para APT e registros de imagens; para HTTPS público, acesso aos serviços de emissão de certificados.
- Uma imagem da aplicação já publicada e acessível pelo Docker do destino.

O playbook não autentica em registros privados.
O pacote GHCR precisa permitir download nas condições do host, ou a autenticação terá de ser preparada externamente.
Escolha um SHA completo já publicado para identificar a versão; o padrão `latest` é mutável.

Para HTTPS público, prepare **dois domínios sob seu controle**, um para a aplicação e outro para o Kuma.
Configure seus registros A para o IP do destino.
Não publique AAAA sem IPv6 funcional; a infraestrutura versionada configura acesso IPv4.
DNS, firewall do sistema e NAT precisam permitir tráfego em TCP `80/443`.

Em um Kuma novo, planeje também uma restrição temporária de acesso externo durante a criação da conta administrativa.
Essa proteção precisa ser preparada fora do playbook, que inicia o painel e seu proxy sem configurar autenticação.
Use o [túnel SSH](operacao-e-seguranca.md#acessar-o-monitoramento) para concluir o acesso inicial por um canal controlado antes de liberar o painel publicamente.

## Provisionar na AWS

Pule esta seção se o host Ubuntu já existe e será configurado sem Terraform.
Consulte [Infraestrutura](infraestrutura.md) para as dependências e limitações do provisionamento.

### Preparar conta, backend e acesso

Tenha Terraform `>= 1.10.0` e AWS CLI para as verificações auxiliares abaixo.
Prepare externamente:

1. Credenciais próprias no perfil `devops-terraform`, exigido pelo provider e pelo backend.
2. Bucket S3 próprio para o estado, com acesso ao objeto de estado e ao lockfile.
3. VPC padrão e subnets com rotas funcionais na região escolhida.
4. Provedor IAM OIDC de `token.actions.githubusercontent.com`, referenciado pelo Terraform.
5. Chave pública em `~/.ssh/cloud-devops-aws-nova.pub` e chave privada correspondente sob seu controle.
6. Permissões para as consultas e recursos definidos, além do acesso ao backend.

Confira a conta e a existência da chave pública, sem imprimir a chave:

```bash
aws sts get-caller-identity --profile devops-terraform
test -f ~/.ssh/cloud-devops-aws-nova.pub
```

Bucket e provedor OIDC não são criados pelo projeto.
Os identificadores OIDC e do CD continuam ligados ao ambiente original; provisionar em outra conta não adapta essas associações.
Um fork precisa revisar os [vínculos do CI/CD](ci-cd.md#vínculos-com-o-ambiente-original) antes de habilitar entrega automática.

### Preencher variáveis e inicializar

Crie o arquivo local sem sobrescrever uma configuração existente:

```bash
cp -n terraform/terraform.tfvars.example terraform/terraform.tfvars
${EDITOR:-vi} terraform/terraform.tfvars
```

Substitua `ssh_allowed_cidr` pelo IPv4/CIDR autorizado e revise região, nome e tipo da instância.
O endereço do modelo é ilustrativo.
Trocar para uma arquitetura diferente exige revisão além do tipo de instância.

O `backend.tf` aponta para um bucket do ambiente original.
Em um checkout destinado ao seu ambiente, selecione o backend próprio sem alterar os arquivos `.tf`:

```bash
read -r -p 'Nome do seu bucket S3 de estado já existente: ' TF_STATE_BUCKET
read -r -p 'Região desse bucket: ' TF_STATE_REGION
terraform -chdir=terraform init -input=false -lockfile=readonly -reconfigure \
  -backend-config="bucket=${TF_STATE_BUCKET:?Informe seu bucket}" \
  -backend-config="region=${TF_STATE_REGION:?Informe a região do bucket}" \
  -backend-config='key=cloud-devops-aws/terraform.tfstate'
```

Não aponte uma reprodução para o estado de outro ambiente.
Não reconfigure um checkout operacional compartilhado sem entender qual estado ele administra.
A região do bucket pode diferir da região dos recursos; ambas precisam estar corretas.
No ambiente original, o `init` sem overrides é apropriado apenas para quem está autorizado a administrar aquele backend.

### Revisar e aplicar o plano

Salve o plano fora do repositório:

```bash
terraform -chdir=terraform fmt -check -diff
terraform -chdir=terraform validate
export TF_PLAN_DIR=$(mktemp -d)
terraform -chdir=terraform plan -out="$TF_PLAN_DIR/implantacao.tfplan"
terraform -chdir=terraform show "$TF_PLAN_DIR/implantacao.tfplan"
```

Interrompa se as verificações falharem ou o plano contiver mudanças inesperadas.
Revise EC2, regras de acesso, IAM e associação do endereço.
A AMI mais recente pode provocar substituição da instância; não presuma preservação do host.
Planos podem conter informações sensíveis e devem permanecer protegidos.

Somente após revisar o plano e aceitar seus efeitos e custos, aplique o arquivo salvo:

```bash
terraform -chdir=terraform apply "$TF_PLAN_DIR/implantacao.tfplan"
terraform -chdir=terraform output -raw ec2_public_ip
terraform -chdir=terraform output -raw ec2_instance_id
terraform -chdir=terraform output -raw ssh_command
```

Use o IP no DNS e no inventário.
O ID da instância não atualiza o valor fixado no CD.
O Terraform não instala a stack; continue com Ansible.

## Configurar o host com Ansible

### Preencher e conferir o inventário

```bash
cp -n ansible/inventory.ini.example ansible/inventory.ini
${EDITOR:-vi} ansible/inventory.ini
ansible-inventory -i ansible/inventory.ini --graph
```

Substitua o endereço ilustrativo pelo IP ou nome alcançável do destino.
Na EC2 da AMI prevista, use `ansible_user=ubuntu`.
Em outro host, use o usuário realmente disponível e autorizado a elevar privilégios.

Informe o host exatamente como aparece no inventário e o caminho da chave privada:

```bash
read -r -p 'Host de destino no inventário: ' TARGET_HOST
read -r -p 'Caminho absoluto da chave privada SSH: ' SSH_KEY
ansible -i ansible/inventory.ini all --limit "${TARGET_HOST:?Informe o host}" --list-hosts
```

Confira a identidade SSH por um canal confiável antes da primeira conexão e registre-a normalmente no `known_hosts`.
Não desabilite a verificação para contornar uma mudança de chave inesperada.
Verifique os módulos remotos e a elevação:

```bash
ansible -i ansible/inventory.ini all --limit "$TARGET_HOST" \
  --private-key "${SSH_KEY:?Informe a chave}" -m ansible.builtin.ping
ansible -i ansible/inventory.ini all --limit "$TARGET_HOST" \
  --private-key "$SSH_KEY" --become -m ansible.builtin.command -a 'id -u'
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --syntax-check
```

O comando remoto `id -u` deve retornar `0` após a elevação.
Se necessário, acrescente `--ask-become-pass` à verificação e à execução do playbook.
Não inclua senhas em argumentos ou no inventário versionado.
O playbook usa `hosts: all`; mantenha `--limit` para restringir o destino.

### Aplicar a configuração com domínios próprios

Informe o SHA de uma imagem publicada no GHCR e os dois domínios preparados:

```bash
read -r -p 'SHA publicado no GHCR, com 40 caracteres: ' IMAGE_SHA
read -r -p 'Domínio da aplicação sob seu controle: ' APP_DOMAIN
read -r -p 'Domínio do monitoramento sob seu controle: ' MONITOR_DOMAIN

if [[ "$IMAGE_SHA" =~ ^[a-f0-9]{40}$ ]] && \
   [[ -n "$APP_DOMAIN" && -n "$MONITOR_DOMAIN" && "$APP_DOMAIN" != "$MONITOR_DOMAIN" ]]; then
  ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
    --limit "${TARGET_HOST:?Informe o host}" --private-key "${SSH_KEY:?Informe a chave}" \
    -e "app_image=ghcr.io/erikgdl/cloud-devops-aws:$IMAGE_SHA" \
    -e "app_domain=$APP_DOMAIN" \
    -e "monitor_domain=$MONITOR_DOMAIN"
else
  printf '%s\n' 'Informe um SHA válido e dois domínios distintos antes de continuar.'
fi
```

Se utilizar sua própria imagem, substitua a referência de `app_image` pelo endereço completo correspondente.
O registro é configurável no Ansible, mas está fixado no workflow de publicação.

No primeiro uso, o playbook cria `.env` com a imagem informada.
Se o arquivo já existe, `app_image` não o substitui.
Confira a versão atual e consulte a [troca manual de versão](operacao-e-seguranca.md#trocar-ou-restaurar-a-versão-da-aplicação) quando necessário.

### Testar uma VM sem DNS público

Uma VM sem domínio público pode usar dois endereços HTTP distintos no Caddyfile:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
  --limit "${TARGET_HOST:?Informe o host}" --private-key "${SSH_KEY:?Informe a chave}" \
  -e app_domain=http://localhost \
  -e monitor_domain=http://monitor.localhost
```

Essa alternativa usa a imagem existente em `.env` ou o padrão `latest` em um host novo.
Para o primeiro uso com SHA, acrescente `-e app_image=REFERENCIA_COMPLETA_DA_IMAGEM` com o valor real.
O host ainda precisa baixar pacotes e imagens; ausência de DNS público não significa execução sem internet.

No servidor, confira os dois sites:

```bash
curl -fSs http://localhost/
curl -I -H 'Host: monitor.localhost' http://127.0.0.1/
```

O segundo comando especifica o cabeçalho que seleciona o site de monitoramento.
Esses testes não demonstram emissão de certificado nem acesso externo.
Para um navegador remoto, veja os [túneis SSH](operacao-e-seguranca.md#acessar-o-monitoramento).

## Validar a implantação

No servidor, com o diretório padrão:

```bash
cd /opt/cloud-devops-aws
sudo docker compose config --quiet
sudo docker compose ps
curl -fSs -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:8080/
sudo docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker compose exec -T caddy wget -q -O /dev/null http://web:8080/
sudo docker compose logs --tail=100 caddy
```

Espere `200` no backend e confira o estado dos três serviços.
O comando de conectividade interna pressupõe `wget` disponível na imagem Caddy em uso; utilize também os logs e a consulta local.

De uma máquina externa, para os domínios públicos configurados, com `dig` e `curl` disponíveis:

```bash
dig +short A "$APP_DOMAIN"
dig +short AAAA "$APP_DOMAIN"
dig +short A "$MONITOR_DOMAIN"
dig +short AAAA "$MONITOR_DOMAIN"
curl -sS -o /dev/null -D - "http://$APP_DOMAIN/"
curl -fSs --retry 10 --retry-delay 3 -o /dev/null -w 'HTTP %{http_code}\n' "https://$APP_DOMAIN/"
curl -I "https://$MONITOR_DOMAIN/"
```

Confira redirecionamento HTTP para HTTPS, resposta `200` do site e abertura do painel de monitoramento.
Não use `-k` como comprovação de HTTPS válido.
Complete a criação de acesso administrativo no Kuma antes de considerar a publicação concluída.

## Preparar o CD somente quando aplicável

A EC2 precisa estar disponível como instância gerenciada no SSM, com agente funcional e conectividade AWS.
Também precisa de `curl`, Docker, Compose e imagens auxiliares já baixadas.
ID da instância, ARN da role, região, subject OIDC e namespace GHCR precisam corresponder ao ambiente pretendido.

Essas condições não são resolvidas apenas pelo `terraform apply` ou pela edição do inventário.
Confira [CI/CD](ci-cd.md) antes de usar um push em `master` como mecanismo de atualização.

## Documentos relacionados

- [Infraestrutura](infraestrutura.md): recursos, estado remoto e requisitos AWS.
- [Automação](automacao.md): variáveis, arquivos gerados e reexecução.
- [Operação e segurança](operacao-e-seguranca.md): Kuma, migração de domínio e diagnóstico.
