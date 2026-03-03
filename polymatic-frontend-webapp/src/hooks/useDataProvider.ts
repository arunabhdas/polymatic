import { useEffect, useRef, useState } from 'react'
import { getDataProvider, type DataProvider } from '@/services/dataProvider'

// ─── useDataProvider ─────────────────────────────────────────
// Returns the DataProvider singleton. Initializes on first use.

export function useDataProvider(): DataProvider | null {
  const [provider, setProvider] = useState<DataProvider | null>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    getDataProvider().then(setProvider).catch(console.error)
  }, [])

  return provider
}
