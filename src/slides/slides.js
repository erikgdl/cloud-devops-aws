import Slide01 from './Slide01'
import Slide02 from './Slide02'
import Slide03 from './Slide03'
import Slide04 from './Slide04'
import Slide05 from './Slide05'
import Slide06 from './Slide06'
import Slide07 from './Slide07'
import Slide08 from './Slide08'
import Slide09 from './Slide09'
import Slide10 from './Slide10'
import Slide11 from './Slide11'
import Slide12 from './Slide12'
import Slide13 from './Slide13'
import Slide14 from './Slide14'
import Slide15 from './Slide15'
import Slide16 from './Slide16'
import Slide17 from './Slide17'
import Slide18 from './Slide18'

// Source: APRESENTACAO-N2.md. Preserve slide order and titles.
const slides = [
    {id: 1, title: "Cloud DevOps", person: 1, chapter: "Abertura", component: Slide01},
    {id: 2, title: "Arquitetura do ambiente", person: 1, chapter: "Arquitetura", component: Slide02},
    {id: 3, title: "Aplicação utilizada no trabalho", person: 2, chapter: "Aplicação", component: Slide03},
    {id: 4, title: "Infraestrutura em nuvem: AWS", person: 2, chapter: "Infraestrutura AWS", component: Slide04},
    {id: 5, title: "Rede, acesso e segurança", person: 3, chapter: "Rede e segurança", component: Slide05},
    {id: 6, title: "Terraform: infraestrutura como código", person: 4, chapter: "Provisionamento", component: Slide06},
    {id: 7, title: "Ansible: configuração automatizada", person: 5, chapter: "Configuração", component: Slide07},
    {
        id: 8,
        title: "Ansible: preparação e verificação dos serviços",
        person: 5,
        chapter: "Configuração",
        component: Slide08
    },
    {id: 9, title: "Dockerfile: construção da imagem", person: 6, chapter: "Construção da imagem", component: Slide09},
    {id: 10, title: "Containers e Docker Compose", person: 6, chapter: "Execução dos serviços", component: Slide10},
    {id: 11, title: "DNS e reverse proxy", person: 7, chapter: "Domínios e proxy", component: Slide11},
    {id: 12, title: "HTTPS e certificados", person: 7, chapter: "Conexão segura", component: Slide12},
    {id: 13, title: "CI: integração contínua", person: 8, chapter: "Integração contínua", component: Slide13},
    {id: 14, title: "CD: publicação e implantação", person: 8, chapter: "Entrega automatizada", component: Slide14},
    {id: 15, title: "Como identificar a versão publicada", person: 9, chapter: "Rastreabilidade", component: Slide15},
    {id: 16, title: "Monitoramento com Uptime Kuma", person: 10, chapter: "Monitoramento", component: Slide16},
    {id: 17, title: "Investigação de falhas e recuperação", person: 10, chapter: "Operação", component: Slide17},
    {id: 18, title: "Resultados, limitações e aprendizados", person: 10, chapter: "Encerramento", component: Slide18},
]

export default slides
