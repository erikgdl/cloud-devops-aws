export default function PresentationButton({ children = 'Apresentação', arrow }) {
  return (
    <a
      href="#/apresentacao/1"
      className={arrow ? 'presentation-button next-link' : 'presentation-button nav-n2'}
    >
      {arrow && <span aria-hidden="true">{arrow}</span>}
      {children}
    </a>
  )
}
