export default function PresentationButton({ children = 'Apresentação', arrow }) {
  return (
    <button
      type="button"
      className={arrow ? 'presentation-button next-link' : 'presentation-button nav-n2'}
      disabled
    >
      {arrow && <span aria-hidden="true">{arrow}</span>}
      {children}
    </button>
  )
}
