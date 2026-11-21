import useVisibleMotion from '../../../../hooks/useVisibleMotion'

const sequence = [
  'React + Vite',
  'GitHub Actions',
  'GitHub Container Registry',
  'Terraform',
  'Amazon EC2',
  'Ansible',
  'Docker Compose',
]

export default function TechnologyStrip() {
  const [strip, running] = useVisibleMotion()

  return (
    <div ref={strip} className="tech-strip wrap">
      <span className="strip-label">Tecnologias do projeto</span>
      <div className="strip-window">
        <div className="strip-track" style={{ animationPlayState: running ? 'running' : 'paused' }}>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? 'Tecnologias do projeto' : undefined}
              aria-hidden={copy === 1 || undefined}
            >
              {sequence.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
