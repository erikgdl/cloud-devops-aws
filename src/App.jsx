import { lazy, Suspense } from 'react'
import useLocationHash from './hooks/useLocationHash'
import Home from './pages/home/Home'

const Presentation = lazy(() => import('./slides/Presentation'))

export default function App() {
  const hash = useLocationHash()
  const isPresentation = /^#\/apresentacao(?:\/|$)/.test(hash)

  if (isPresentation) {
    const slideNumber = Number(hash.split('/')[2]) || 1
    return (
      <Suspense
        fallback={
          <main className="presentation-loading" role="status">
            Abrindo apresentação…
          </main>
        }
      >
        <Presentation number={slideNumber} />
      </Suspense>
    )
  }

  return <Home hash={hash} />
}
