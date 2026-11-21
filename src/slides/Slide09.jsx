import SlideLayout from './components/SlideLayout'
import {CodeBlock, Tech} from './components/Visuals'
import Icon from './components/Icon'

export default function Slide09() {
    return <SlideLayout title="Dockerfile: construção da imagem"
                        lead="Duas etapas. Um artefato de execução sem o ambiente de desenvolvimento.">
        <div className="n2-build-stages">
            <div className="n2-build-stage"><span className="n2-stage-label">Etapa de construção</span><h2>Node.js
                24</h2><CodeBlock label="build"
                                  lines={['FROM node:24-bookworm-slim AS build', 'COPY package.json package-lock.json ./', 'RUN npm ci', 'RUN npm run build']}/>
                <p>Dependências do lockfile.<br/>Build estático com Vite.</p></div>
            <div className="n2-build-artifact"><Icon name="file"/><code>dist/</code><span>HTML · CSS · JS</span></div>
            <div className="n2-build-stage n2-build-runtime"><span className="n2-stage-label">Etapa de execução</span>
                <h2>Nginx</h2><CodeBlock label="production"
                                         lines={['FROM nginx:stable-alpine AS production', 'COPY nginx.conf /etc/nginx/nginx.conf', 'COPY --from=build /app/dist/ /usr/share/nginx/html/', 'USER nginx', 'EXPOSE 8080']}/>
                <p>Conteúdo compilado + configuração.<br/>Porta publicada pelo Compose.</p></div>
        </div>
        <div className="n2-slide-signoff"><Tech name="docker">Build multi-stage</Tech><span>Construir e servir são responsabilidades diferentes.</span>
        </div>
    </SlideLayout>
}
