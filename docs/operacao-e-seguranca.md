# Operar e verificar o ambiente com segurança

Este guia reúne verificação de serviços, administração do monitoramento, troca de versão e investigação de falhas.
Os comandos no servidor pressupõem `/opt/cloud-devops-aws`, Docker/Compose e permissão de `sudo`.
Para outro `app_dir`, ajuste os caminhos locais; o CD continua usando o caminho fixado no workflow.

## Verificar serviços e logs

No servidor:

```bash
cd /opt/cloud-devops-aws
sudo docker compose config --quiet
sudo docker compose ps
sudo docker compose images
sudo docker compose logs --tail=100 web
sudo docker compose logs --tail=100 caddy
sudo docker compose logs --tail=100 uptime-kuma
curl -fSs -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:8080/
```

Espere `200` no backend.
Um contêiner em execução não comprova saúde completa: não há `healthcheck` declarado nos Composes.
O Nginx encaminha logs para stdout/stderr.
Não há coleta centralizada, política explícita de rotação de logs ou métricas Prometheus/Grafana versionadas no projeto.

Revise dados de ambiente antes de compartilhar configuração, logs ou resultados SSM.
O `--quiet` evita imprimir toda a configuração na verificação básica.

## Conferir domínios, proxy e HTTPS

Confira o arquivo efetivamente montado no Caddy e sua conexão com a aplicação:

```bash
cd /opt/cloud-devops-aws
sudo docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker compose exec -T caddy wget -q -O /dev/null http://web:8080/
sudo docker compose logs --tail=100 caddy
```

A consulta interna depende de `wget` disponível na imagem Caddy em uso; utilize também os logs e a consulta ao backend local.
O Caddyfile possui um site para `app_domain` e outro para `monitor_domain`.
Para domínios públicos, confira externamente DNS, roteamento, firewall, redirecionamento HTTP e certificado HTTPS.
Os comandos estão em [Validar a implantação](implantacao.md#validar-a-implantação).

Uma resposta no backend ou um redirecionamento em `80` não comprova HTTPS externo.
Os volumes `caddy_data` e `caddy_config` preservam estado do Caddy, incluindo material de certificados em `/data`.
Não remova esses volumes como tentativa inicial de corrigir emissão de certificados nem compartilhe seu conteúdo publicamente.

### Alterar ou migrar domínios

Faça a alteração por `app_domain` e `monitor_domain` na [execução do Ansible](implantacao.md#aplicar-a-configuração-com-domínios-próprios).
Passe as duas variáveis, inclusive ao usar um domínio temporário, para não reaplicar os padrões do ambiente original inadvertidamente.
O handler recarrega o Caddyfile após as tarefas, sem apagar volumes.

Em uma migração, preserve os registros do serviço anterior até validar o novo destino com um domínio temporário sob seu controle.
A documentação anterior utilizava `teste-aws.devops.erikgdl.xyz` nesse papel; ele não é o padrão atual do playbook.
Confirme DNS, certificado, conteúdo e monitoramento antes de alterar os registros principais.
Não há automação de DNS ou migração de domínio no repositório.

## Acessar o monitoramento

O playbook publica a porta direta do Kuma em `127.0.0.1:3001`, mas configura um proxy público no `monitor_domain`.
Trate o painel como serviço exposto à internet quando o domínio público apontar para o host.
O playbook não cria conta administrativa, política de autenticação, monitores ou notificações.

Na primeira implantação, conclua a configuração administrativa por um canal controlado antes de liberar acesso público ao painel.
Uma possibilidade de acesso direto é o túnel SSH, executado no computador do operador:

```bash
read -r -p 'IP ou nome SSH do servidor: ' SERVER_HOST
read -r -p 'Usuário SSH do servidor: ' SERVER_USER
read -r -p 'Caminho absoluto da chave privada SSH: ' SSH_KEY
ssh -N -L 127.0.0.1:3001:127.0.0.1:3001 \
  -i "${SSH_KEY:?Informe a chave}" "${SERVER_USER:?Informe o usuário}@${SERVER_HOST:?Informe o servidor}"
```

Com o túnel aberto, acesse `http://localhost:3001`.
O túnel não desativa o proxy público nem acrescenta autenticação a ele.
O usuário precisa ter SSH autorizado; na EC2, o CIDR do operador precisa estar liberado.

Para conferir o site pelo backend em uma VM sem DNS, abra outro túnel em uma segunda sessão:

```bash
ssh -N -L 127.0.0.1:8080:127.0.0.1:8080 \
  -i "${SSH_KEY:?Informe a chave}" "${SERVER_USER:?Informe o usuário}@${SERVER_HOST:?Informe o servidor}"
```

Abra `http://localhost:8080`.
Esse acesso não valida Caddy ou HTTPS.
As variáveis precisam estar definidas também na nova sessão.

### Cadastrar monitores úteis

Cadastre manualmente no Kuma um monitor HTTP para `http://web:8080/`.
No contêiner do Kuma, `localhost` representa o próprio Kuma, não a aplicação.
O nome `web` é resolvido pela rede compartilhada do Compose.

Cadastre separadamente uma verificação do HTTPS público da aplicação, para observar o percurso pelo domínio e pelo proxy.
Configure notificações conforme os recursos do Kuma e seus canais; não há integração de alertas versionada.
Monitores e dados administrativos ficam em `kuma_data`.

O monitoramento no mesmo host pode deixar de operar quando esse host falha.
Uma verificação externa independente exige outro serviço ou host, não implementado neste repositório.

## Trocar ou restaurar a versão da aplicação

O CD seleciona automaticamente a tag SHA publicada.
Em uma intervenção manual, evite executar simultaneamente com um deploy do GitHub Actions.
Não há lock ou rollback automático no workflow.

No servidor, registre a referência atual antes de editar:

```bash
cd /opt/cloud-devops-aws
sudo docker compose images
sudo cat .env
```

O `.env` gerado atualmente contém somente `APP_IMAGE`.
Se o ambiente tiver valores adicionais, revise localmente e não compartilhe a saída.
Escolha um SHA anterior conhecido ou o SHA da nova versão, já publicado:

```bash
read -r -p 'SHA da imagem a implantar, com 40 caracteres: ' IMAGE_SHA
if [[ "$IMAGE_SHA" =~ ^[a-f0-9]{40}$ ]]; then
  IMAGE="ghcr.io/erikgdl/cloud-devops-aws:$IMAGE_SHA"
  if sudo docker pull "$IMAGE"; then
    printf 'APP_IMAGE=%s\n' "$IMAGE" | sudo tee .env > /dev/null
    sudo docker compose up -d --pull never && \
      curl -fsS --retry 10 --retry-connrefused --retry-delay 3 http://127.0.0.1:8080/ > /dev/null
  fi
else
  printf '%s\n' 'SHA inválido; nenhuma versão foi selecionada.'
fi
```

O procedimento reproduz a seleção usada pelo CD e regrava `.env` com uma única variável.
Ele pressupõe diretório correto, acesso ao GHCR e imagens auxiliares já disponíveis.
Se houver configurações adicionais em `.env`, preserve-as em vez de executar a regravação acima.

Repita as verificações locais e externas após a troca.
Em falha da versão, selecione manualmente o SHA anterior registrado e repita o procedimento.
Isso restaura a aplicação estática; não restaura dados do Kuma ou versões do Caddy.
Uma nova execução do CD pode voltar a alterar a referência.

## Preservar volumes e planejar recuperação

Os volumes declarados são `kuma_data`, `caddy_data` e `caddy_config`.
Seus nomes reais no Docker normalmente recebem o prefixo do projeto Compose; não estão fixados por `name:` ou `external:`.
Alterar diretório ou nome do projeto pode criar outros volumes, fazendo os serviços aparentarem uma instalação vazia.

Identifique os volumes e mounts efetivamente usados:

```bash
cd /opt/cloud-devops-aws
sudo docker volume ls
sudo docker inspect "$(sudo docker compose ps -q uptime-kuma)" --format '{{json .Mounts}}'
sudo docker inspect "$(sudo docker compose ps -q caddy)" --format '{{json .Mounts}}'
```

O `ps -q` dos exemplos pressupõe serviços em execução.
Para interromper e remover contêineres e rede, mantendo os volumes nomeados:

```bash
cd /opt/cloud-devops-aws
sudo docker compose down
```

**Não utilize `docker compose down -v` para uma parada normal:** essa opção remove os volumes e pode apagar monitores, contas e estado de certificados.
Reinicie com `sudo docker compose up -d --pull never` somente se as imagens necessárias estiverem disponíveis.
O `restart: unless-stopped` depende de Docker ativo e não recupera dados perdidos.

O projeto não fornece rotina de backup ou restauração.
Antes de substituir a EC2 ou migrar de host, identifique os volumes reais e estabeleça backup consistente com os serviços e versões.
Inclua Compose, Caddyfile e referência da aplicação no plano de recuperação, protegendo dados administrativos e material do Caddy.
Teste a restauração em um destino separado; copiar apenas o repositório não recupera o monitoramento existente.

Parar contêineres não encerra cobranças AWS.
A remoção de recursos exige revisão do estado e dos dados persistentes; não há script de limpeza automática.

## Administrar credenciais e acessos

- Mantenha chaves privadas e credenciais AWS fora do repositório e das imagens.
- Use credenciais próprias no perfil `devops-terraform` e confirme a conta antes de operar Terraform.
- Restrinja `ssh_allowed_cidr` ao necessário; a validação não obriga um único IP.
- Proteja bucket de estado e planos; `encrypt = true` não substitui controle de acesso e retenção.
- Não inclua tokens ou senhas em `-e`, commits, logs ou exemplos publicados.
- Proteja a administração do Kuma, pois seu domínio pode ser público.
- Trate acesso Docker e `sudo` como acessos administrativos ao host.

O `.gitignore` exclui `*.tfvars`, estado, cache Terraform e `ansible/inventory.ini`.
Não há exclusões genéricas para `.env`, `*.pem`, `*.key` ou `*.tfplan`.
Revise os arquivos antes de adicioná-los ao Git.
O `.dockerignore` reduz o contexto de build, mas não substitui essa revisão.

O CD utiliza OIDC para a AWS e `GITHUB_TOKEN` para publicar no GHCR.
Não há gerenciador de segredos, Ansible Vault ou rotação de credenciais implementados no projeto.

## Investigar falhas

| Sintoma | Verificações iniciais |
| --- | --- |
| Terraform falha no `init` | Perfil, conta, bucket, região e permissões do estado/lock |
| Terraform não encontra rede | VPC padrão e subnets na região |
| Plano substitui EC2 | AMI mais recente, parâmetros e estado; preservar dados antes de aceitar |
| SSH não conecta | IP, rota, CIDR autorizado, chave, usuário e identidade SSH |
| Ansible falha em módulos | Python remoto, Ansible, APT/systemd e elevação |
| Docker/Compose indisponível no APT | Versão Ubuntu e repositórios habilitados |
| Download de imagem falha | Nome/tag, SHA existente, conectividade e acesso ao registro |
| Nova `app_image` não aparece | `.env` preservado pelo Ansible; conferir imagem em execução |
| Bind de porta falha | Outro serviço ocupando portas da stack |
| Backend responde, domínio falha | A/AAAA, rotas, firewall, Caddyfile e logs |
| Caddy retorna erro de upstream | Estado de `web`/Kuma, porta e rede Compose |
| Kuma aparenta instalação vazia | Nome do projeto e volumes realmente montados |
| CD não publica após PR | Publicação exige CI de push na `master` do mesmo repositório |
| OIDC não assume a role | Provedor existente, ARN, audiência e subject do token |
| SSM não executa | ID fixado no CD, região, IAM, agente, conectividade e resultado da invocação |
| CD falha em `--pull never` | Bootstrap Ansible e imagens auxiliares no host |

Em falha SSM, consulte a etapa de deploy no GitHub Actions e o resultado apresentado pelo workflow.
Confira o estado do host antes de reenviar atualizações.

## Pontos para revisão técnica

Estas observações descrevem o código atual; não são correções já aplicadas ou recursos prometidos.

| Ponto | Evidência e impacto |
| --- | --- |
| ECR Public na interface | Textos em [sections/](../src/pages/home/sections/) divergem do GHCR de [cd.yml](../.github/workflows/cd.yml) |
| Dois ambientes ilustrados | Inventário de exemplo com um host, sem evidências versionadas dos dois destinos |
| Bootstrap AWS parcial | Bucket, provedor OIDC e rede padrão não são criados pelo projeto |
| CD específico | ARN, região, ID da EC2, namespace GHCR e caminho fixados no workflow |
| SSM Agent e `curl` | Não são instalados explicitamente pelas automações |
| Proteções diferentes | `cap_drop` e `no-new-privileges` locais ausentes no Compose gerado |
| Imagens mutáveis | Bases, Caddy, Kuma e padrão `latest` não fixados por digest |
| Exposição do Kuma | Domínio público exige configuração administrativa e avaliação de acesso |
| Validação limitada | Checks não verificam HTTPS público nem monitores; sem suíte de testes |
| Entregas concorrentes | Sem `concurrency`, rollback automático ou aprovação por ambiente |
| Persistência local | Volumes no mesmo host, sem backup/recuperação automatizados |
| Arquivos sensíveis locais | `.gitignore` sem exclusões genéricas de ambiente, chaves e planos |
| Licença | Sem licença geral na raiz |

## Documentos relacionados

- [Arquitetura](arquitetura.md): comunicação e fronteiras do sistema.
- [Implantação](implantacao.md): preparação e verificações externas.
- [Automação](automacao.md): reexecução e arquivos gerados.
- [CI/CD](ci-cd.md): atualização SSM e limitações do pipeline.
