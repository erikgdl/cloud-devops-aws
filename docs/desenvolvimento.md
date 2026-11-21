# Desenvolver e verificar a aplicação

Este guia reúne a execução local do frontend, a construção da imagem e as verificações disponíveis no repositório.
Os comandos partem da raiz do clone.
As etapas de servidor estão em [Implantação](implantacao.md).

## Preparar o ambiente local

Para trabalhar diretamente com o frontend, tenha Git, Node.js e npm disponíveis.
Utilize Node **24** como referência, acompanhando a versão principal do [Dockerfile](../Dockerfile).
O projeto não contém `.nvmrc` nem um campo `engines` próprio em [package.json](../package.json).

O [package-lock.json](../package-lock.json) fixa a árvore de dependências.
As versões nele selecionadas incluem React `19.3.1`, Vite `8.3.8` e ESLint `10.15.0`.
Os requisitos de Node de Vite e ESLint precisam ser considerados juntos: na linha 22, o ESLint selecionado exige pelo menos `22.13.0`.
O CI solicita a linha 22; o Dockerfile solicita a linha 24.

```sh
node --version
npm --version
npm ci
npm run dev
```

Abra o endereço apresentado pelo Vite.
O comando de desenvolvimento não inicia Caddy, Kuma ou infraestrutura AWS.
Não há variável de ambiente obrigatória para o frontend atual.

## Verificar e compilar

```sh
npm run lint
npm run build
npm run preview
```

O lint utiliza [eslint.config.js](../eslint.config.js), com regras JavaScript, React Hooks e React Refresh.
O build utiliza [vite.config.js](../vite.config.js) e gera `dist/`.
O preview permite inspecionar esse resultado localmente; não é o servidor utilizado na imagem de produção.

Não há script `test`, suíte de testes automatizados ou cobertura configurados no projeto.
Lint e compilação não substituem a verificação visual e funcional.
Ao alterar a interface, confira navegação por âncoras, teclado, menu em telas estreitas e preferência de movimento reduzido.

## Executar com Docker e Compose

Tenha Docker configurado para contêineres Linux e o plugin Compose v2.
Node não precisa estar instalado no host que executa o build Docker.
O Docker baixa as imagens-base e o estágio de construção instala as dependências.

Em Bash:

```bash
docker build -t cloud-devops:local .
HTTP_PORT=8080 docker compose config --quiet
HTTP_PORT=8080 docker compose up -d
docker compose ps
curl -I http://localhost:8080/
```

Em PowerShell, defina a variável de ambiente antes de executar o Compose:

```powershell
$env:HTTP_PORT = '8080'
docker build -t cloud-devops:local .
docker compose config --quiet
docker compose up -d
docker compose ps
curl.exe -I http://localhost:8080/
```

Para encerrar a execução local:

```sh
docker compose down
```

O [Compose da raiz](../docker-compose.yaml) possui somente `web` e não tem seção `build`.
Por isso, a imagem precisa ser construída ou obtida antes de `up`.

| Variável | Padrão | Efeito no Compose local |
| --- | --- | --- |
| `APP_IMAGE` | `cloud-devops:local` | Referência da imagem do serviço `web` |
| `HTTP_PORT` | `80` | Porta publicada no host; o destino no contêiner permanece `8080` |

As variáveis podem vir do ambiente ou de um `.env` local:

```dotenv
APP_IMAGE=cloud-devops:local
HTTP_PORT=8080
```

O `.gitignore` atual não exclui `.env` genericamente.
Mantenha esse arquivo fora dos commits e não armazene segredos nele.
O Compose publica a porta do host sem restrição explícita a loopback; a aplicação pode ficar acessível por outras interfaces conforme a rede e o firewall.
Em Docker rootless, a publicação de portas baixas pode exigir configuração do host; `8080` evita depender da porta `80`.

Para utilizar uma imagem já publicada, substitua a referência abaixo por uma tag SHA disponível:

```bash
export APP_IMAGE='ghcr.io/erikgdl/cloud-devops-aws:SUBSTITUA_PELO_SHA_PUBLICADO'
export HTTP_PORT=8080
docker compose pull
docker compose up -d
```

O host precisa conseguir baixar essa imagem.
Se o pacote não permitir acesso anônimo, será necessária autenticação externa à automação atual.

## Entender a imagem e o servidor estático

O estágio `build` utiliza `node:24-bookworm-slim`.
Primeiro copia os manifestos e executa `npm ci`, permitindo reutilização do cache antes de copiar os fontes.
Depois executa `npm run build`.

O estágio `production` utiliza `nginx:stable-alpine` e recebe somente o build e [nginx.conf](../nginx.conf).
O processo é executado como usuário `nginx`, com PID e temporários em `/tmp`.
Os logs vão para stdout/stderr.
O Nginx inclui os tipos MIME e escuta na porta não privilegiada `8080`; não há ajuste de `sysctl` no Compose atual.

As imagens-base usam tags mutáveis.
O lockfile npm fixa dependências, mas não garante sozinho builds idênticos quando as imagens-base mudam.

O [.dockerignore](../.dockerignore) permite apenas os arquivos necessários ao build: manifestos, configuração Vite/Nginx, HTML, `src/` e `public/`.
Documentação, Git, dependências locais e builds anteriores ficam fora do contexto.
Há exclusões adicionais de arquivos de ambiente, chaves e temporários nas árvores permitidas.
Essas exclusões não impedem segredos escritos diretamente em código de serem publicados.

## Distinguir os dois Composes

| Aspecto | Compose da raiz | Compose gerado pelo Ansible |
| --- | --- | --- |
| Finalidade | Execução direta da aplicação | Stack do servidor |
| Serviços | `web` | `web`, `caddy`, `uptime-kuma` |
| Publicação web | `${HTTP_PORT:-80}:8080` | `127.0.0.1:8080:8080`, atrás do Caddy |
| Domínios e TLS | Não configurados | Caddyfile gerado com dois sites |
| Variáveis no `.env` | `APP_IMAGE` e opcionalmente `HTTP_PORT` | Inicialmente somente `APP_IMAGE` |
| Proteções Compose | `cap_drop: ALL` e `no-new-privileges:true` | Não contém essas opções |

O usuário `nginx` faz parte da imagem e vale nas duas formas de execução.
As proteções adicionais do Compose local não devem ser atribuídas ao Compose do servidor.

## Verificar configurações sem provisionar

Os comandos abaixo são procedimentos opcionais para quem já possui as ferramentas.
Não aplicam infraestrutura nem executam o playbook contra hosts.

```bash
terraform -chdir=terraform fmt -check -diff
terraform -chdir=terraform validate
ansible-playbook -i ansible/inventory.ini.example ansible/playbook.yml --syntax-check
docker compose config --quiet
```

O `terraform validate` pressupõe providers já instalados e não valida credenciais, conectividade AWS ou existência dos recursos externos.
Em um diretório de trabalho destinado à validação, a inicialização sem backend pode ser feita com:

```bash
terraform -chdir=terraform init -backend=false -input=false -lockfile=readonly
```

Esse comando pode baixar providers e grava cache local; não é necessário executá-lo se a inicialização já está adequada.
Um `fmt -check` malsucedido sinaliza formatação existente; não autoriza alterações de configuração durante uma revisão apenas documental.

### Verificar Compose e Caddyfile embutidos

Para verificar também os conteúdos inline do playbook, utilize Python com `PyYAML` e `Jinja2` já disponíveis no ambiente do Ansible.
O Python selecionado deve acessar essas bibliotecas.
O procedimento cria somente cópias temporárias com domínios ilustrativos.
Ele precisa de Docker e da imagem `caddy:2-alpine` disponível ou acessível para download.

```bash
export VALIDATION_DIR=$(mktemp -d)
python3 - <<'PY'
import os
from pathlib import Path

import yaml
from jinja2 import Template

play = yaml.safe_load(Path('ansible/playbook.yml').read_text())[0]
values = dict(play['vars'])
values.update(app_domain='app.example.org', monitor_domain='monitor.example.org')
dest = Path(os.environ['VALIDATION_DIR'])
(dest / 'caddy').mkdir()
for task in play['tasks']:
    copy = task.get('ansible.builtin.copy', {})
    for suffix in ('/compose.yml', '/caddy/Caddyfile'):
        if copy.get('dest', '').endswith(suffix):
            (dest / suffix.lstrip('/')).write_text(
                Template(copy['content']).render(**values) + '\n'
            )
PY
APP_IMAGE=cloud-devops:local docker compose -f "$VALIDATION_DIR/compose.yml" config --quiet
docker run --rm --network none \
  --mount "type=bind,src=$VALIDATION_DIR/caddy,dst=/etc/caddy,readonly" \
  caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

O contêiner descartável valida o Caddyfile sem rede; não inicia o proxy nem solicita certificados.
Essa verificação de sintaxe não comprova que o ambiente público funcionará.

## Localizar os arquivos da aplicação

| Alteração | Arquivo ou diretório |
| --- | --- |
| Inicialização React | [src/main.jsx](../src/main.jsx) |
| Composição global e navegação por âncoras | [src/App.jsx](../src/App.jsx) |
| Ordem dos capítulos | [HomePage.jsx](../src/pages/home/HomePage.jsx) |
| Conteúdo de cada capítulo | [sections/](../src/pages/home/sections/) |
| Capa, desenho do servidor e faixa de tecnologias | [opening/](../src/pages/home/sections/opening/) |
| Diagrama visual da arquitetura | [Architecture.jsx](../src/pages/home/sections/Architecture.jsx) e [Architecture.css](../src/pages/home/sections/Architecture.css) |
| Diagrama visual da portabilidade | [Portability.jsx](../src/pages/home/sections/Portability.jsx) e [portability.css](../src/pages/home/sections/portability.css) |
| Estilos comuns dos capítulos | [home.css](../src/pages/home/home.css) |
| Cabeçalho e rodapé | [layout/](../src/components/layout/) |
| Acessos à apresentação | [PresentationButton.jsx](../src/components/PresentationButton.jsx) |
| Palco, navegação e controles da N2 | [Presentation.jsx](../src/slides/Presentation.jsx) |
| Conteúdo e ordem dos 18 slides | [slides/](../src/slides/) e [slides.js](../src/slides/slides.js) |
| Animações por visibilidade e rolagem | [hooks/](../src/hooks/) |
| Cores, fontes e espaçamento | [tokens.css](../src/styles/tokens.css) |
| Foco, links e estilos globais | [global.css](../src/styles/global.css) |
| Logos e licenças visuais | [assets/architecture/](../src/assets/architecture/) |
| Favicon e créditos publicados | [public/](../public/) |

## Documentos relacionados

- [Direção visual](design-direction.md): intenção visual e acessibilidade observável.
- [Apresentação N2](apresentacao.md): navegação e manutenção dos slides.
- [Implantação](implantacao.md): execução no servidor.
- [CI/CD](ci-cd.md): verificações automatizadas e publicação.
- [Operação e segurança](operacao-e-seguranca.md): acesso público e diagnóstico.
