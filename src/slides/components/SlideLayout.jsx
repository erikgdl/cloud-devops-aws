export default function SlideLayout({title, eyebrow, lead, children, note, className = ''}) {
    return (
        <div className={`n2-slide ${className}`}>
            <div className="n2-slide-heading">
                {eyebrow && <p className="n2-eyebrow">{eyebrow}</p>}
                <h1 id="n2-slide-title" tabIndex={-1}>{title}</h1>
                {lead && <p className="n2-lead">{lead}</p>}
            </div>
            <div className="n2-slide-content">{children}</div>
            {note && <p className="n2-note">{note}</p>}
        </div>
    )
}
