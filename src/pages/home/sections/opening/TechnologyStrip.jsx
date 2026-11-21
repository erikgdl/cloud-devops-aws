import useVisibleMotion from '../../../../hooks/useVisibleMotion'

const technologyNames = [
  'React + Vite',
  'GitHub Actions',
  'GitHub Container Registry',
  'Terraform',
  'Amazon EC2',
  'Ansible',
  'Docker Compose',
]

export default function TechnologyStrip() {
  const [stripRef, isRunning] = useVisibleMotion()

  return (
    <div ref={stripRef} className="tech-strip wrap">
      <span className="strip-label">Tecnologias do projeto</span>
      <div className="strip-window">
        <div
          className="strip-track"
          style={{ animationPlayState: isRunning ? 'running' : 'paused' }}
        >
          {/* A segunda cópia mantém o loop contínuo sem repetir a lista para leitores de tela. */}
          {[0, 1].map((copyIndex) => (
            <ul
              key={copyIndex}
              aria-label={copyIndex === 0 ? 'Tecnologias do projeto' : undefined}
              aria-hidden={copyIndex === 1 || undefined}
            >
              {technologyNames.map((technologyName) => (
                <li key={technologyName}>{technologyName}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
