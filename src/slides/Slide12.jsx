import SlideLayout from './components/SlideLayout'
import { Node, Callout } from './components/Visuals'
import Icon from './components/Icon'

export default function Slide12() {
  return (
    <SlideLayout
      title="HTTPS e certificados"
      lead="O HTTPS protege a conexão pública entre navegador e Caddy. O certificado precisa ser válido para o domínio acessado."
    >
      <div className="n2-tls-route">
        <Node icon="browser" title="Navegador" />
        <div className="n2-secure-link">
          <Icon name="lock" />
          <strong>HTTPS / TLS</strong>
          <span>Certificado válido para o domínio</span>
        </div>
        <Node icon="certificate" title="Caddy" detail="Emissão e renovação automáticas" accent />
        <div className="n2-internal-link">
          <strong>HTTP</strong>
          <span>Rede Docker</span>
        </div>
        <Node icon="server" title="Serviço" detail="web ou Kuma" />
      </div>
      <div className="n2-certificate-details">
        <div>
          <Icon name="file" />
          <h2>Caddyfile</h2>
          <p>Domínios e destinos de proxy.</p>
        </div>
        <div>
          <Icon name="storage" />
          <h2>Volumes</h2>
          <p>Estado e certificados preservados.</p>
        </div>
        <Callout label="Pré-requisitos">DNS correto e TCP 80/443 acessíveis publicamente.</Callout>
      </div>
    </SlideLayout>
  )
}
