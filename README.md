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
