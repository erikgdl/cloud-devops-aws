# Direção visual e organização da interface

Este documento explica as decisões visuais observáveis na aplicação acadêmica **Anatomia de um deploy**.
Ele relaciona apresentação, estilos e comportamento aos arquivos reais do frontend.
A arquitetura operacional é descrita em [Arquitetura da solução](arquitetura.md).

## Narrativa da página

[HomePage.jsx](../src/pages/home/HomePage.jsx) apresenta sete seções: abertura, problema, solução, arquitetura, tecnologias, portabilidade e defesa.
A navegação usa âncoras na mesma página, com tratamento de foco em [App.jsx](../src/App.jsx).
Não há roteador por caminhos nem página de slides integrada.

A capa combina o título com uma vista axonométrica do registro de imagens, do host Ubuntu e da aplicação HTTP.
O desenho é construído em SVG por [SignalField.jsx](../src/pages/home/sections/opening/SignalField.jsx).
[Opening.jsx](../src/pages/home/sections/opening/Opening.jsx) organiza título e ações; [TechnologyStrip.jsx](../src/pages/home/sections/opening/TechnologyStrip.jsx) compõe a faixa de tecnologias.

O quadro de arquitetura organiza a publicação da imagem e a preparação do host.
O quadro de portabilidade ilustra um playbook direcionado a dois tipos de destino Ubuntu.
O encerramento apresenta a defesa acadêmica N2.
Os desenhos explicam a proposta, mas não comprovam execução ou teste dos ambientes representados.

## Cores, tipografia e composição

[tokens.css](../src/styles/tokens.css) concentra cores, famílias tipográficas, medidas e espaçamentos.
O fundo escuro, o azul e o verde-lima estruturam a identidade da página.
O azul marca elementos de infraestrutura; o verde-lima destaca o percurso animado e ações disponíveis.

Os tokens tipográficos distinguem texto corrente, títulos, trechos de contexto e rótulos técnicos.
As famílias são declaradas com alternativas de sistema; não há importação de fontes externas nos estilos.
O metadado de tema em [index.html](../index.html) e o [favicon](../public/favicon.svg) prolongam a identidade fora da árvore React.

[home.css](../src/pages/home/home.css) define a composição comum dos capítulos, incluindo altura mínima de uma tela para as seções após a abertura.
Os estilos específicos ficam próximos dos componentes, como [Architecture.css](../src/pages/home/sections/Architecture.css), [portability.css](../src/pages/home/sections/portability.css) e [opening.css](../src/pages/home/sections/opening/opening.css).
As media queries reorganizam colunas e navegação em telas menores.

## Movimento e interação

[useScrollReveals.js](../src/hooks/useScrollReveals.js) observa a entrada dos blocos na área de leitura.
As regras de revelação em `home.css` são condicionadas à preferência de movimento do navegador.
[useVisibleMotion.js](../src/hooks/useVisibleMotion.js) pausa as animações da capa e da faixa quando o elemento está fora da área visível, o documento está oculto ou há preferência por movimento reduzido.

[global.css](../src/styles/global.css) desativa animações e transições para `prefers-reduced-motion: reduce`.
A faixa de tecnologias passa a uma disposição estática nesse modo.
O comportamento reduz movimento sem exigir outra versão do conteúdo.

[SiteLayout.jsx](../src/components/layout/SiteLayout.jsx) implementa cabeçalho, menu responsivo e rodapé.
O menu informa seu estado com `aria-expanded` e permite fechamento por Escape.
A interface possui indicação de foco e uma ação para pular ao conteúdo.
Esses mecanismos estão presentes no código; não equivalem a uma certificação ou auditoria completa de acessibilidade.

## Recursos visuais e créditos

Os logos ficam em [src/assets/architecture/](../src/assets/architecture/).
[ToolMark.jsx](../src/components/ToolMark.jsx) encapsula sua exibição como elementos decorativos junto aos nomes das ferramentas.
O rodapé aponta para os [créditos publicados](../public/creditos-icones.txt).

As licenças estão em [LICENSE](../src/assets/architecture/LICENSE) e [LICENSE-devicon](../src/assets/architecture/LICENSE-devicon), além das referências no arquivo de créditos.
Essas atribuições são específicas dos recursos visuais.

## Limitações atuais

Textos e diagramas da interface ainda mencionam ECR Public, enquanto o pipeline utiliza GHCR.
A representação de portabilidade não comprova implantação nos dois destinos ilustrados.
As divergências foram preservadas no código e registradas em [Pontos para revisão técnica](operacao-e-seguranca.md#pontos-para-revisão-técnica).

Os três acessos à apresentação utilizam [PresentationButton.jsx](../src/components/PresentationButton.jsx), que renderiza um botão nativo desabilitado.
Não existe link ativo para slides ou rota de apresentação.

## Documentos relacionados

- [Desenvolvimento](desenvolvimento.md#localizar-os-arquivos-da-aplicação): mapa dos arquivos e verificações da interface.
- [Arquitetura](arquitetura.md): comportamento real dos serviços e fluxos.
- [Índice da documentação](README.md): demais referências técnicas.
