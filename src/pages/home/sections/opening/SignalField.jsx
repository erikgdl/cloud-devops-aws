import useVisibleMotion from '../../../../hooks/useVisibleMotion'

const pull = 'M168 122l53 28 36-19 58 30'
const serve = 'M319 205l-79 42-52-27-48 26'

function Trace({ path, delay }) {
  return (
    <g fill="none" strokeLinejoin="round">
      <path d={path} stroke="var(--rack-side)" strokeWidth="9" />
      <path d={path} stroke="var(--blue)" strokeWidth="2" />
      <path
        className="packet"
        pathLength="100"
        d={path}
        stroke="var(--acid)"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ '--delay': delay }}
      />
    </g>
  )
}

function Registry() {
  return (
    <g stroke="var(--etch)" strokeWidth="1.25" strokeLinejoin="round">
      <path fill="var(--blue-face)" d="m61 75 77-41 68 35-77 41Z" />
      <path fill="var(--night)" d="m61 75 68 35v48l-68-35Z" />
      <path fill="var(--rack-side)" d="m129 110 77-41v48l-77 41Z" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${69 + i * 6.6} ${86 + i * 3.4}v30 M${137 + i * 7.5} ${112 - i * 4}v30`}
        />
      ))}
      <path d="m88 77 49-26 34 17-49 26Z" fill="var(--blue)" />
      <path d="m114 75 11 5 20-11" stroke="var(--white)" strokeWidth="3" fill="none" />
    </g>
  )
}

function Host() {
  return (
    <g stroke="var(--etch)" strokeWidth="1.25" strokeLinejoin="round">
      <path fill="var(--blue-face)" d="m289 156 85-45 76 39-85 46Z" />
      <path fill="var(--ink)" d="m289 156 76 40v49l-76-39Z" />
      <path fill="var(--rack-side)" d="m365 196 85-46v49l-85 46Z" />
      {[0, 1, 2].map((n) => (
        <g key={n} transform={`translate(0 ${n * 14})`}>
          <path fill="var(--night)" d="m295 165 64 33v8l-64-33Z" />
          <path d="m301 172 6 3" stroke="var(--acid)" strokeWidth="2.6" />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, n) => (
        <path key={n} d={`M${373 + n * 6.3} ${198 - n * 3.4}v31`} />
      ))}
      <path d="m323 155 50-27 39 20-50 27Z" fill="var(--blue)" />
      <path d="m337 155 14-8m-7 12 24-13m-17 17 33-18" stroke="var(--line)" />
    </g>
  )
}

export default function SignalField() {
  const [figure, running] = useVisibleMotion()
  return (
    <figure
      ref={figure}
      className="cover-figure"
      style={{ '--play-state': running ? 'running' : 'paused' }}
    >
      <svg viewBox="0 0 500 330" role="img" aria-labelledby="trace-title">
        <title id="trace-title">
          O Docker no host Ubuntu baixa a imagem do ECR Public. O contêiner disponibiliza a
          aplicação por HTTP.
        </title>
        <defs>
          <pattern id="plane" width="48" height="25" patternUnits="userSpaceOnUse">
            <path d="m0 0 48 25m0-25L0 25" stroke="var(--divider)" fill="none" strokeWidth=".7" />
          </pattern>
        </defs>
        <path d="m14 153 211-112 264 139-210 111Z" fill="url(#plane)" />
        <Trace path={pull} delay="0s" />
        <Trace path={serve} delay="2.1s" />
        <Registry />
        <Host />
        <g strokeLinejoin="round">
          <path d="m80 249 45-24 40 21-45 24Z" stroke="var(--blue)" fill="var(--rack-side)" />
          <path
            d="m80 249 40 21v7l-40-21Zm40 21 45-24v7l-45 24Z"
            stroke="var(--blue)"
            fill="var(--night)"
          />
          <path
            d="m110 244-9 5 8 5m22-12 9 5-8 5"
            fill="none"
            stroke="var(--acid)"
            strokeWidth="2.5"
          />
        </g>
        <g stroke="var(--muted)" fill="none">
          <path d="M48 49v53h10M393 105V72h33M119 282v13h31" />
        </g>
        <g className="plate-label" fill="var(--paper)">
          <text x="22" y="39">
            ECR Public
          </text>
          <text x="352" y="62">
            Host Ubuntu
          </text>
          <text x="157" y="301">
            Aplicação HTTP
          </text>
        </g>
      </svg>
      <figcaption>
        <a href="#arquitetura">Explorar a arquitetura ↘</a>
      </figcaption>
    </figure>
  )
}
