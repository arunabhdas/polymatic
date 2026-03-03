import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/Tooltip'
import { App } from '@/App'
import '@/styles/globals.css'

// Initialize theme from persisted state
const persisted = localStorage.getItem('polymatic-ui')
if (persisted) {
  try {
    const { state } = JSON.parse(persisted) as { state: { theme?: string } }
    if (state?.theme) {
      document.documentElement.setAttribute('data-theme', state.theme)
    }
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
} else {
  document.documentElement.setAttribute('data-theme', 'dark')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)
