import { technologyLogos } from '../../assets/architecture/logos'
import ToolMark from '../../components/ToolMark'
import Icon from './Icon'

export function Tech({ name, children, size = 28 }) {
  return (
    <span className="n2-tech">
      <ToolMark logo={technologyLogos[name]} size={size} />
      {children}
    </span>
  )
}

export function Node({ icon, title, detail, accent = false, children, className = '' }) {
  return (
    <div className={`n2-node ${accent ? 'n2-node-accent' : ''} ${className}`}>
      {icon && <Icon name={icon} />}
      <strong>{title}</strong>
      {detail && <span>{detail}</span>}
      {children}
    </div>
  )
}

export function Flow({ items, className = '', numbered = false }) {
  return (
    <ol className={`n2-flow ${className}`}>
      {items.map((item, index) => (
        <li key={item.title}>
          {numbered && <span className="n2-step-number">{String(index + 1).padStart(2, '0')}</span>}
          {item.icon && <Icon name={item.icon} />}
          <strong>{item.title}</strong>
          {item.detail && <span>{item.detail}</span>}
        </li>
      ))}
    </ol>
  )
}

export function Callout({ label, children, className = '' }) {
  return (
    <aside className={`n2-callout ${className}`}>
      {label && <strong>{label}</strong>}
      <span>{children}</span>
    </aside>
  )
}

export function CodeBlock({ label, lines }) {
  return (
    <div className="n2-code-block">
      <span className="n2-code-label">{label}</span>
      <pre>
        <code>{lines.join('\n')}</code>
      </pre>
    </div>
  )
}

export function DataTable({ headers, rows, className = '' }) {
  return (
    <div className={`n2-table-wrap ${className}`}>
      <table className="n2-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th scope="col" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) =>
                columnIndex === 0 ? (
                  <th scope="row" key={columnIndex}>
                    {cell}
                  </th>
                ) : (
                  <td key={columnIndex}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
