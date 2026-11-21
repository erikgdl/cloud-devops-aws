# Apresentação N2

A apresentação integra 18 slides ao frontend React/Vite, seguindo a ordem e o conteúdo de [APRESENTACAO-N2.md](../APRESENTACAO-N2.md).
[FALAS-N2.md](../FALAS-N2.md) continua sendo um roteiro separado para os integrantes; suas notas não aparecem nos slides.
Não há nomes de integrantes ou professor inventados: os responsáveis são identificados como Pessoa 1 a Pessoa 10, conforme a fonte.

## Abrir e navegar

Inicie o projeto conforme [Desenvolvimento](desenvolvimento.md) e clique em **Apresentação** no menu, na capa ou no encerramento da home.
O endereço relativo é `/#/apresentacao/1`.
Troque o número final, de 1 a 18, para abrir diretamente outro slide.

| Controle | Comportamento |
| --- | --- |
| Anterior / Próximo | Navegação sequencial, respeitando início e fim |
| Setas esquerda / direita | Slide anterior / seguinte |
| Page Up / Page Down | Slide anterior / seguinte |
| Home / End | Primeiro / último slide |
| Visão geral | Abre o índice dos 18 slides; Escape fecha o diálogo |
| Tela cheia | Solicita o modo nativo do navegador, quando disponível |
| Controles, em tela cheia | Abre ou recolhe a barra flutuante, sem reservar espaço no palco |
| Marca Cloud DevOps | Retorna à home |

O endereço usa hash para funcionar com o Nginx estático existente, inclusive após atualizar a página.
Não foi adicionada uma rota HTTP `/apresentacao` nem alterada a configuração de infraestrutura.
Tela cheia depende do suporte e das permissões do navegador.
Os controles ficam em uma única barra inferior compacta.
Em tela cheia, a barra é recolhida por padrão e pode ser aberta pelo botão **Controles**, no canto inferior direito.
As setas continuam navegando com a barra fechada; Escape permite sair da tela cheia.

## Estrutura e edição

| Arquivo | Responsabilidade |
| --- | --- |
| [Slide01.jsx](../src/slides/Slide01.jsx) a [Slide18.jsx](../src/slides/Slide18.jsx) | Composições individuais dos slides |
| [slides.js](../src/slides/slides.js) | Importações, ordem, títulos e responsáveis |
| [Presentation.jsx](../src/slides/Presentation.jsx) | Palco, navegação, diálogo e controles |
| [components/](../src/slides/components/) | Layout, ícones SVG, fluxos, tabelas e blocos técnicos |
| [presentation.css](../src/slides/presentation.css) | Composição horizontal, responsividade e movimento |
| [PresentationButton.jsx](../src/components/PresentationButton.jsx) | Links compartilhados da home |

Os componentes contêm resumos visuais do Markdown; o arquivo-fonte não é interpretado em tempo de execução.
Ao alterar o material, atualize o componente correspondente e preserve a coerência com `slides.js` e as falas.
A apresentação é carregada sob demanda pelo App, sem adicionar bibliotecas ou modificar os manifestos de dependências.

## Identidade e limites

Os slides utilizam a paleta e as famílias tipográficas de [tokens.css](../src/styles/tokens.css), além dos logos já existentes.
A composição varia por assunto, com diagramas de infraestrutura, sequência Ansible, build em dois estágios e fluxos de entrega.
Somente o slide atual é montado.

O desktop horizontal é o formato prioritário.
Em telas estreitas, o slide atual pode ter rolagem vertical para manter a legibilidade; os 18 slides não são empilhados como uma página longa.
Os loops explicativos iniciam automaticamente e continuam durante o slide, sem botão de pausa.
A preferência do sistema `prefers-reduced-motion: reduce` continua desativando as animações.

Os diagramas são explicativos.
O slide de monitoramento identifica sua representação como ilustrativa, sem simular métricas ou disponibilidade reais.
Não há conexão em tempo real com GitHub Actions, AWS ou Uptime Kuma, e nenhum controle executa provisionamento ou deploy.

## Verificar alterações

Execute `npm run lint` e `npm run build` após modificar os componentes.
Confira no navegador os três acessos da home, os 18 slides, anterior/próximo, teclado, índice, atualização de URL, retorno à home e tela cheia.
Revise também uma tela estreita e a preferência de movimento reduzido.
Use o Markdown como referência para conferir conteúdo e ordem; nomes de pessoas, métricas e resultados externos precisam de informações confirmadas pelo grupo.
