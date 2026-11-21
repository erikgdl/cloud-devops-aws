# Configuração e automação com Ansible

Este documento referencia o único playbook do projeto, [ansible/playbook.yml](../ansible/playbook.yml).
Ele prepara o host Ubuntu e gera a stack de execução.
Os comandos para preencher o inventário e aplicar o playbook estão em [Implantação](implantacao.md#configurar-o-host-com-ansible).

## Estrutura e escopo

O diretório [ansible/](../ansible/) contém o playbook e [inventory.ini.example](../ansible/inventory.ini.example).
Não há roles, arquivos de handlers separados, `group_vars`, `host_vars`, requirements de collections ou `ansible.cfg` versionados.
As tarefas usam módulos `ansible.builtin` e comandos Docker.
Compose e Caddyfile são conteúdo inline de tarefas `copy`.

O play utiliza `hosts: all` e `become: true`.
O grupo `[servidores]` do modelo organiza o inventário, mas não limita o alcance do play.
Todos os hosts selecionados no inventário podem ser configurados; a opção `--limit` restringe uma execução específica.

## Condições de compatibilidade

| Local | Condições necessárias |
| --- | --- |
| Controlador | Ansible com os módulos usados, OpenSSH e ambiente compatível, como Linux ou WSL |
| Destino | Ubuntu com APT e systemd; Python disponível para os módulos remotos |
| Acesso | SSH funcional, identidade do host conferida e usuário com permissão de elevação |
| Pacotes | Repositórios que disponibilizem `docker.io` e `docker-compose-v2` |
| Rede de saída | Acesso aos repositórios APT, ao registro da aplicação e às imagens Caddy/Kuma |
| Rede de entrada | Portas livres e acessíveis conforme o modo de publicação escolhido |

A referência de sistema do Terraform é Ubuntu 24.04 `amd64`.
O playbook não contém uma verificação de distribuição nem uma versão mínima explícita do Ansible.
Compatibilidade com outra versão de Ubuntu ou arquitetura precisa ser verificada antes da execução.
O pipeline não publica explicitamente uma matriz de imagens para múltiplas arquiteturas.

Não há módulo AWS, SDK de provedor ou descoberta dinâmica de hosts no playbook.
Ele pode ser reaplicado em uma VM ou máquina física compatível, desde que os requisitos acima sejam atendidos.
Isso não provisiona o host nem comprova uma implantação anterior em outro provedor.

## Inventário

O modelo contém um host ilustrativo e o usuário `ubuntu`:

```ini
[servidores]
192.0.2.10 ansible_user=ubuntu
```

O arquivo operacional esperado é `ansible/inventory.ini`, ignorado pelo Git.
O IP pode ser o Elastic IP da EC2 ou o endereço alcançável de outro servidor compatível.
O usuário e a chave precisam corresponder ao destino; `ubuntu` é uma convenção da AMI utilizada, não uma exigência universal.

A chave pode ser informada por `--private-key`, como nos procedimentos, ou pela variável de conexão `ansible_ssh_private_key_file`.
O repositório não fornece uma chave privada.
Não há configuração versionada desabilitando a verificação da identidade SSH.

## Variáveis do playbook

| Variável | Padrão atual | Responsabilidade |
| --- | --- | --- |
| `app_dir` | `/opt/cloud-devops-aws` | Diretório de configuração no host |
| `app_image` | `ghcr.io/erikgdl/cloud-devops-aws:latest` | Referência gravada somente na criação inicial de `.env` |
| `app_domain` | `devops.erikgdl.xyz` | Endereço do site no Caddyfile |
| `monitor_domain` | `monitor.erikgdl.xyz` | Endereço do Kuma no Caddyfile |

Os domínios padrão pertencem ao ambiente original.
Uma reprodução precisa fornecer os próprios valores para **ambas** as variáveis de domínio.
As variáveis do bloco `vars` podem ser sobrescritas com extra vars (`-e`), como demonstrado no guia de implantação.

O diretório padrão também é fixado no script de CD.
Sobrescrever `app_dir` no Ansible não adapta o workflow automaticamente.

## Sequência de tarefas

1. Instala `docker.io` e `docker-compose-v2`, atualizando o cache APT quando necessário.
2. Habilita e inicia o serviço Docker pelo systemd.
3. Cria o diretório da aplicação e o subdiretório `caddy/`, com modo `0755`.
4. Grava o Caddyfile e notifica o handler de recarga quando o conteúdo muda.
5. Grava `compose.yml` com os três serviços e três volumes nomeados.
6. Cria `.env` com `APP_IMAGE`, modo `0644` e `force: false`.
7. Executa `docker compose up -d --pull always` no diretório da aplicação.
8. Consulta `http://127.0.0.1:8080/`, sem seguir redirecionamentos, exigindo status `200`.
9. Executa o handler notificado de `caddy reload` ao final do play, se a execução chegar a essa etapa.

O teste HTTP tem até dez tentativas, com intervalo de três segundos.
Ele valida o serviço web local; não testa o domínio de monitoramento, o certificado ou o proxy público.
O playbook não instala explicitamente `curl`, usado pelo CD, nem o SSM Agent.

## Arquivos e serviços gerados

Os caminhos abaixo existem no servidor após uma execução bem-sucedida com `app_dir` padrão:

| Caminho no host | Origem e comportamento |
| --- | --- |
| `/opt/cloud-devops-aws/compose.yml` | Conteúdo gerenciado pelo playbook; sobrescrito quando necessário |
| `/opt/cloud-devops-aws/caddy/Caddyfile` | Dois sites, cada um com um destino de proxy |
| `/opt/cloud-devops-aws/.env` | Somente a referência `APP_IMAGE` inicial; preservado nas reexecuções |

| Serviço | Imagem | Porta publicada no host | Persistência |
| --- | --- | --- | --- |
| `web` | `${APP_IMAGE}` | `127.0.0.1:8080:8080` | Sem volume de dados |
| `caddy` | `caddy:2-alpine` | `80:80` e `443:443` | `caddy_data`, `caddy_config` e Caddyfile montado somente para leitura |
| `uptime-kuma` | `louislam/uptime-kuma:2` | `127.0.0.1:3001:3001` | `kuma_data` em `/app/data` |

Todos utilizam `restart: unless-stopped` e a rede padrão do Compose.
O Caddy depende de `web` por `depends_on`, sem condição de saúde configurada.
Não existem blocos `healthcheck` no Compose gerado.

## Reexecução e limites da automação

As tarefas de pacotes, diretórios e arquivos convergem para o estado descrito.
Entretanto, `up --pull always` consulta as imagens em cada execução, e tags mutáveis podem introduzir atualizações.
O campo `changed_when` do comando analisa mensagens de criação e inicialização em `stderr`; não é uma verificação completa de convergência.

Uma alteração em `app_image` passada com `-e` **não troca a imagem de um `.env` já existente**.
O arquivo é preservado para não desfazer a versão selecionada pelo CD.
O procedimento de troca manual de versão está em [Operação e segurança](operacao-e-seguranca.md#trocar-ou-restaurar-a-versão-da-aplicação).

Uma alteração no Caddyfile notifica a recarga sem remover volumes.
Uma falha anterior ao handler pode impedir a aplicação dessa recarga; a validação operacional precisa confirmar a configuração em uso.

O playbook não configura DNS, firewall do host, usuários do Kuma, monitores ou backups.
Ele também não autentica o Docker em registros privados e não replica os volumes entre servidores.

## Documentos relacionados

- [Arquitetura](arquitetura.md): relação entre os serviços.
- [Implantação](implantacao.md): conexão SSH, extra vars e aplicação do playbook.
- [Desenvolvimento](desenvolvimento.md): diferenças do Compose local e validação das configurações inline.
- [Operação e segurança](operacao-e-seguranca.md): domínios, monitoramento e persistência.
