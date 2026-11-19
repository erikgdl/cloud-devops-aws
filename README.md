# Cloud DevOps

Site acadêmico de DevOps e Computação em Nuvem em React e Vite. A página percorre a publicação da imagem Docker, a preparação do servidor e o uso do mesmo playbook Ansible em dois ambientes Ubuntu.

## Executar localmente

Na raiz do repositório, instale as dependências e inicie o servidor de desenvolvimento.

```sh
npm ci
npm run dev
```

Use `npm run lint` para verificar o código, `npm run build` para gerar o site em `dist/` e `npm run preview` para conferir esse build.

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
