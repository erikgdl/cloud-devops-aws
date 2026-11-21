const paths = {
    server: <>
        <rect x="4" y="3" width="24" height="10" rx="2"/>
        <rect x="4" y="19" width="24" height="10" rx="2"/>
        <path d="M9 8h.01M9 24h.01M15 8h8M15 24h8M16 13v6"/>
    </>,
    cloud: <path d="M9 24a7 7 0 0 1-1-14 9 9 0 0 1 17-1 7.5 7.5 0 0 1-1 15ZM12 18l4-4 4 4m-4-4v13"/>,
    lock: <>
        <rect x="7" y="13" width="18" height="16" rx="3"/>
        <path d="M11 13V8a5 5 0 0 1 10 0v5M16 20v3"/>
    </>,
    file: <>
        <path d="M8 3h11l6 6v20H8ZM19 3v7h6M12 16h9M12 21h9"/>
    </>,
    container: <>
        <path d="m4 9 12-6 12 6v15l-12 6-12-6ZM4 9l12 6 12-6M16 15v15M10 6l12 6v6"/>
    </>,
    pulse: <>
        <path d="M2 17h7l4-10 6 20 4-10h7"/>
        <path d="M3 4h26M3 29h26" opacity=".3"/>
    </>,
    network: <>
        <rect x="11" y="2" width="10" height="8" rx="1"/>
        <rect x="2" y="23" width="10" height="7" rx="1"/>
        <rect x="20" y="23" width="10" height="7" rx="1"/>
        <path d="M16 10v7M7 23v-6h18v6"/>
    </>,
    browser: <>
        <rect x="2" y="4" width="28" height="24" rx="3"/>
        <path d="M2 11h28M7 8h.01M11 8h.01M11 17l-4 3 4 3M21 17l4 3-4 3"/>
    </>,
    git: <>
        <circle cx="9" cy="6" r="3"/>
        <circle cx="9" cy="26" r="3"/>
        <circle cx="25" cy="9" r="3"/>
        <path d="M9 9v14M22 9h-3a10 10 0 0 0-10 10"/>
    </>,
    check: <path d="m6 16 7 7L27 8"/>,
    search: <>
        <circle cx="14" cy="14" r="9"/>
        <path d="m21 21 8 8M10 14h8M14 10v8"/>
    </>,
    certificate: <>
        <path d="M21 28H5V3h22v14M10 9h12M10 14h7"/>
        <circle cx="23" cy="22" r="5"/>
        <path d="m20 26-1 5 4-2 4 2-1-5"/>
    </>,
    storage: <>
        <ellipse cx="16" cy="6" rx="12" ry="4"/>
        <path d="M4 6v10c0 5 24 5 24 0V6M4 16v10c0 5 24 5 24 0V16"/>
    </>,
    terminal: <>
        <rect x="2" y="4" width="28" height="24" rx="3"/>
        <path d="m7 12 5 4-5 4M16 21h9"/>
    </>,
}

export default function Icon({name = 'server', className = ''}) {
    return <svg className={`n2-icon ${className}`} viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet"
                focusable="false" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">{paths[name] || paths.server}</svg>
}
