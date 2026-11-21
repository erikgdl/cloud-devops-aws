import SlideLayout from './components/SlideLayout'
import { Node, Callout } from './components/Visuals'

export default function Slide05() {
  return (
    <SlideLayout
      title="Rede, acesso e segurança"
      lead="A configuração separa as entradas públicas das portas de diagnóstico. O Caddy recebe o tráfego público e encaminha aos serviços pela rede Docker."
      note="O Kuma também é exposto pelo domínio no Caddy. Loopback na porta direta não torna o painel privado."
    >
      <div className="n2-security-map">
        <div className="n2-port-zone">
          <h2>Entrada pública</h2>
          <div className="n2-port-pair">
            <div>
              <b>80</b>
              <span>HTTP</span>
            </div>
            <div>
              <b>443</b>
              <span>HTTPS</span>
            </div>
          </div>
          <p>Security Group permite acesso IPv4.</p>
        </div>
        <Node icon="lock" title="Caddy" detail="Proxy na rede Docker" accent />
        <div className="n2-port-zone n2-private-zone">
          <h2>Diagnóstico no host</h2>
          <div className="n2-port-pair">
            <div>
              <b>8080</b>
              <span>Aplicação</span>
            </div>
            <div>
              <b>3001</b>
              <span>Kuma</span>
            </div>
          </div>
          <code>127.0.0.1</code>
        </div>
      </div>
      <div className="n2-access-notes">
        <Callout label="SSH · porta 22">
          Operador e Ansible. Origem limitada ao CIDR autorizado.
        </Callout>
        <Callout label="OIDC + SSM">
          Actions assume a role com credenciais temporárias e envia o deploy.
        </Callout>
      </div>
    </SlideLayout>
  )
}
