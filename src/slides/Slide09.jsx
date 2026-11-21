import SlideLayout from './components/SlideLayout'
import { CodeBlock, Tech } from './components/Visuals'
import Icon from './components/Icon'

const buildInstructions = [
  'FROM node:24-bookworm-slim AS build',
  'COPY package.json package-lock.json ./',
  'RUN npm ci',
  'RUN npm run build',
]

const runtimeInstructions = [
  'FROM nginx:stable-alpine AS production',
  'COPY nginx.conf /etc/nginx/nginx.conf',
  'COPY --from=build /app/dist/ /usr/share/nginx/html/',
  'USER nginx',
  'EXPOSE 8080',
]

export default function Slide09() {
  return (
    <SlideLayout
      title="Dockerfile: construção da imagem"
      lead="O Dockerfile separa a construção da aplicação de sua execução. O ambiente de compilação não precisa permanecer na imagem final."
    >
      <div className="n2-build-stages">
        <div className="n2-build-stage">
          <span className="n2-stage-label">Etapa de construção</span>
          <h2>Node.js 24</h2>
          <CodeBlock label="build" lines={buildInstructions} />
          <p>
            Dependências do lockfile.
            <br />
            Build estático com Vite.
          </p>
        </div>
        <div className="n2-build-artifact">
          <Icon name="file" />
          <code>dist/</code>
          <span>HTML · CSS · JS</span>
        </div>
        <div className="n2-build-stage n2-build-runtime">
          <span className="n2-stage-label">Etapa de execução</span>
          <h2>Nginx</h2>
          <CodeBlock label="production" lines={runtimeInstructions} />
          <p>
            Conteúdo compilado + configuração.
            <br />
            Porta publicada pelo Compose.
          </p>
        </div>
      </div>
      <div className="n2-slide-signoff">
        <Tech name="docker">Build multi-stage</Tech>
        <span>Construir e servir são responsabilidades diferentes.</span>
      </div>
    </SlideLayout>
  )
}
