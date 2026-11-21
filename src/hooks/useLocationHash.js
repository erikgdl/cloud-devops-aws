import { useEffect, useState } from 'react'

export default function useLocationHash() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    function syncHash() {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  return hash
}
