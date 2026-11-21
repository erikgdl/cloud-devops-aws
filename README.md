# Cloud DevOps

Site acadêmico de DevOps e Computação em Nuvem em React e Vite. A página percorre a publicação da imagem Docker, a preparação do servidor e o uso do mesmo playbook Ansible em dois ambientes Ubuntu.

## Executar localmente

Na raiz do repositório, instale as dependências e inicie o servidor de desenvolvimento.

```sh
npm ci
npm run dev
```

Use `npm run lint` para verificar o código, `npm run build` para gerar o site em `dist/` e `npm run preview` para conferir esse build.

## Executar com Docker em produção

É necessário Docker com suporte a containers Linux e Docker Compose v2 ou posterior.
Node.js não precisa estar instalado na máquina que constrói ou executa a imagem.

```sh
docker build -t cloud-devops:local .
docker compose config
docker compose up -d
docker compose ps
curl -I http://localhost/
```

Abra `http://localhost/`. Para parar e remover o container e a rede padrão do Compose:

```sh
docker compose down
```

O Compose executa uma imagem pronta; ele não faz o build. `APP_IMAGE` seleciona a
imagem (padrão `cloud-devops:local`) e `HTTP_PORT` define a porta do host (padrão `80`).
Essas variáveis podem ser definidas no ambiente ou em um arquivo `.env` local:

```dotenv
APP_IMAGE=cloud-devops:local
HTTP_PORT=8080
```

Nesse exemplo, acesse `http://localhost:8080/`. Para usar futuramente uma imagem de
registro público, basta mudar `APP_IMAGE`, executar `docker compose pull` e depois
`docker compose up -d`. Nenhuma alteração no Compose é necessária.

O estágio `build` usa Node 24 LTS, compatível com o requisito do Vite instalado
(`^20.19.0 || >=22.12.0`). Os manifestos são copiados antes do código para reutilizar
o cache de `npm ci`; o lockfile fixa as dependências e `npm run build` gera `dist/`.
O estágio `production` usa a imagem oficial `nginx:stable-alpine` e recebe somente
o resultado compilado e a configuração do servidor, sem Node.js ou fontes React.
As tags das imagens-base recebem atualizações; builds bit a bit idênticos exigiriam
fixar também seus digests.

O Nginx roda como usuário `nginx`, com PID e arquivos temporários em `/tmp` e logs
na saída do container. O Compose remove as capabilities e impede novos privilégios.
O sysctl `net.ipv4.ip_unprivileged_port_start=0` permite escutar na porta 80 dentro
do namespace do container sem executar como root. Isso não altera o sysctl do host.
Em Docker rootless, publicar a porta 80 do host pode exigir configuração adicional
do host; nesse caso, use `HTTP_PORT=8080`.

A configuração inclui os tipos MIME de CSS, JavaScript e imagens. Como a navegação
atual usa âncoras (`#projeto`, `#arquitetura`), não há fallback de rotas para
`index.html`: arquivos inexistentes retornam 404. Se forem adicionadas rotas React
por caminho no futuro, essa decisão deverá ser revisada.

O `.dockerignore` permite somente os arquivos necessários ao build, excluindo por
padrão dependências locais, builds anteriores, Git, IDEs, documentação e caches.
Arquivos de ambiente, chaves, logs e temporários também são excluídos dentro de
`src/` e `public/`. Se o build passar a depender de novos arquivos, inclua-os
explicitamente no Dockerfile e no `.dockerignore`.

## HTTPS no servidor (PR #8)

O único playbook, `ansible/playbook.yml`, gerencia o Compose de produção em
`/opt/cloud-devops-aws/compose.yml`. O `docker-compose.yaml` da raiz continua sendo
a opção de execução local descrita acima.

O Caddy recebe HTTP/HTTPS em TCP 80/443 e encaminha para `web:8080` na rede do
Compose. O domínio padrão é **`teste-aws.devops.erikgdl.xyz`**. O domínio principal
**`devops.erikgdl.xyz` deve permanecer no servidor antigo** durante a validação.
Não há gerenciamento de DNS neste PR. O Terraform apenas acrescenta a entrada
pública TCP 443, preservando HTTP, SSH restrito e saída existentes.

Os volumes `caddy_data` (`/data`) e `caddy_config` (`/config`) persistem certificados
e estado. `kuma_data` e o serviço `uptime-kuma` mantêm os nomes existentes. Os três
serviços compartilham a rede padrão: o monitor **`http://web:8080`** continua válido.
O painel Kuma fica exclusivamente em `127.0.0.1:3001`; não há proxy público para ele.
Não use `docker compose down -v`: isso apagaria os dados desses volumes.

O backend publica somente `127.0.0.1:8080`. Ansible e CD verificam essa porta para
chegar à aplicação, sem aceitar como sucesso apenas o redirecionamento HTTP do
Caddy. A validação externa de DNS, certificado e proxy é uma etapa separada abaixo.
O CD mantém imagem com SHA, GHCR, OIDC e SSM. O `.env` continua contendo somente
`APP_IMAGE`; o domínio é configurado no Caddyfile pelo Ansible e não é perdido
quando o CD reescreve o `.env`.

`app_domain` pode ser sobrescrito com `-e app_domain=outro.dominio`. O Ansible usa
somente Ubuntu, Docker e Compose, sem SDK ou dependências de provedor: funciona
com hosts compatíveis em AWS, Azure, GCP e VirtualBox usando o inventário existente.
Em uma VM isolada sem DNS público, `-e app_domain=http://localhost` permite testar
o proxy por HTTP dentro da VM. Para HTTPS público, os registros A/AAAA precisam
apontar para esse host e TCP 80/443 precisam estar acessíveis, inclusive no firewall
do sistema e no NAT, quando houver. Não publique AAAA sem IPv6 configurado.
Consulte os [requisitos de HTTPS automático do Caddy](https://caddyserver.com/docs/automatic-https).

O diretório `caddy/` é montado em modo de leitura. Ao mudar o Caddyfile, um handler
executa `caddy reload` após iniciar os serviços, aplicando também mudanças de
domínio sem recriar os volumes. Reexecutar o playbook preserva o `.env` existente
(`force: false`), portanto preserva a versão SHA já implantada.

### Validação local sem aplicar infraestrutura

Os comandos a seguir usam Bash (Linux/WSL), Terraform inicializado e Ansible.
Execute na raiz. `terraform init -backend=false` só é necessário se os providers
ainda não estiverem instalados; não executa plano nem aplicação.

```sh
terraform -chdir=terraform init -backend=false -input=false -lockfile=readonly
terraform -chdir=terraform fmt -check -diff
terraform -chdir=terraform validate
ansible-playbook -i ansible/inventory.ini.example ansible/playbook.yml --syntax-check
docker compose config --quiet
```

Para validar exatamente o Compose e o Caddyfile embutidos no playbook, gere cópias
temporárias. PyYAML e Jinja2 já fazem parte do ambiente do Ansible. Este comando
não executa o playbook nem inicia os serviços; `caddy validate` roda em container
descartável sem rede e sem solicitar certificados:

```sh
export VALIDATION_DIR=$(mktemp -d)
python3 - <<'PY'
import os
from pathlib import Path
import yaml
from jinja2 import Template

play = yaml.safe_load(Path('ansible/playbook.yml').read_text())[0]
dest = Path(os.environ['VALIDATION_DIR'])
(dest / 'caddy').mkdir()
for task in play['tasks']:
    copy = task.get('ansible.builtin.copy', {})
    for suffix in ('/compose.yml', '/caddy/Caddyfile'):
        if copy.get('dest', '').endswith(suffix):
            (dest / suffix.lstrip('/')).write_text(
                Template(copy['content']).render(**play['vars']) + '\n')
PY
APP_IMAGE=cloud-devops:local docker compose -f "$VALIDATION_DIR/compose.yml" config --quiet
docker run --rm --network none \
  --mount "type=bind,src=$VALIDATION_DIR/caddy,dst=/etc/caddy,readonly" \
  caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

### Aplicação manual, após revisão

Execute a migração antes de integrar este PR em `master`: o CD atualizado já
espera o backend no loopback 8080 e as imagens auxiliares instaladas pelo Ansible.

1. Na máquina com as credenciais Terraform existentes, gere e revise um plano:

   ```sh
   terraform -chdir=terraform init -input=false -lockfile=readonly
   terraform -chdir=terraform plan -out=pr8.tfplan
   terraform -chdir=terraform show pr8.tfplan
   ```

   O esperado é apenas uma nova regra TCP 443. Se houver outras alterações,
   especialmente substituição da EC2 por atualização da AMI, pare e investigue.
   Somente após aprovar esse plano, aplique o arquivo revisado:

   ```sh
   terraform -chdir=terraform apply pr8.tfplan
   terraform -chdir=terraform output -raw ec2_public_ip
   ```

2. Em uma etapa manual autorizada, configure **somente** o registro A de
   `teste-aws.devops.erikgdl.xyz` para esse IP. Preserve o registro do domínio
   principal. Confirme a propagação e eventuais registros AAAA antes de continuar:

   ```sh
   dig +short A teste-aws.devops.erikgdl.xyz
   dig +short AAAA teste-aws.devops.erikgdl.xyz
   dig +short A devops.erikgdl.xyz
   ```

3. Preencha o inventário já previsto pelo projeto, sem criar outro modelo:

   ```sh
   cp -n ansible/inventory.ini.example ansible/inventory.ini
   ${EDITOR:-vi} ansible/inventory.ini
   ```

   Use o IP de destino e `ansible_user=ubuntu`. Informe um SHA completo já
   publicado no GHCR para o primeiro provisionamento. Em um servidor já
   provisionado, o `.env` atual será preservado; confira que ele já usa um SHA.

   ```sh
   read -r -p 'SHA da imagem já publicada (40 caracteres): ' IMAGE_SHA
   [[ "$IMAGE_SHA" =~ ^[a-f0-9]{40}$ ]] && \
     ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
       --private-key ~/.ssh/cloud-devops-aws-nova \
       -e "app_image=ghcr.io/erikgdl/cloud-devops-aws:$IMAGE_SHA" \
       -e app_domain=teste-aws.devops.erikgdl.xyz
   ```

4. No servidor, valide backend, configuração e conectividade interna:

   ```sh
   cd /opt/cloud-devops-aws
   sudo docker compose config --quiet
   sudo docker compose ps
   curl -fsS http://127.0.0.1:8080/ > /dev/null
   sudo docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
   sudo docker compose exec -T caddy wget -q -O /dev/null http://web:8080/
   sudo docker compose logs --tail=100 caddy
   ```

   De fora do servidor, confira o redirecionamento e o HTTPS com certificado
   válido, sem `-k`. O primeiro comando deve mostrar 308 para o domínio de teste;
   o segundo deve terminar com código HTTP 200 e retornar o HTML da aplicação:

   ```sh
   curl -sS -o /dev/null -D - http://teste-aws.devops.erikgdl.xyz/
   curl -fSs --retry 10 --retry-delay 3 -w '\nHTTP %{http_code}\n' https://teste-aws.devops.erikgdl.xyz/
   ```

   Para conferir no Kuma o monitor existente `http://web:8080`, abra um túnel na
   sua máquina e acesse `http://localhost:3001`:

   ```sh
   ssh -N -L 3001:127.0.0.1:3001 -i ~/.ssh/cloud-devops-aws-nova ubuntu@IP_NOVO
   ```

O domínio principal só deve migrar em uma etapa posterior, após validar o domínio
de teste. Este procedimento não o altera.

## Onde editar

| Alteração | Arquivo ou pasta |
| --- | --- |
| Ordem dos capítulos | `src/pages/home/HomePage.jsx` |
| Conteúdo de um capítulo | Componente correspondente em `src/pages/home/sections/` |
| Capa, desenho do servidor e faixa de tecnologias | `src/pages/home/sections/opening/` |
| Diagrama de arquitetura | `sections/Architecture.jsx` e `sections/Architecture.css`, dentro da home |
| Diagrama de portabilidade | `sections/Portability.jsx` e `sections/portability.css`, dentro da home |
| Estilos comuns dos capítulos e entradas na rolagem | `src/pages/home/home.css` |
| Cabeçalho, menu, marca e rodapé | `src/components/layout/` |
| Acesso à apresentação | `src/components/PresentationButton.jsx`, usado pelo menu, pela capa e pelo encerramento |
| Comportamento das animações | `src/hooks/` |
| Paleta, tipografia e espaçamentos | `src/styles/tokens.css` |
| Foco, links e estilos compartilhados | `src/styles/global.css` |
| Logos das ferramentas | `src/assets/architecture/` |
| Favicon e créditos publicados | `public/` |

`src/main.jsx` inicia o React. `src/App.jsx` monta o cabeçalho, a home e o rodapé e cuida da navegação por âncoras. Os três acessos à apresentação usam um botão nativo desabilitado. Quando os slides estiverem disponíveis, o componente compartilhado é o ponto para conectar a rota.
