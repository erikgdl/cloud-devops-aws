export default function ToolMark({ logo, size = 34 }) {
  return (
    <span className="tool-mark" aria-hidden="true">
      <img src={logo} alt="" width={size} height={size} />
    </span>
  )
}
