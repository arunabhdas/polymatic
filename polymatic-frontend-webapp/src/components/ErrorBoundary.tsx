import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <AlertTriangle
            size={40}
            className="text-[var(--color-warning)] mb-4"
            strokeWidth={1.5}
          />
          <p className="mono-label text-[var(--color-text-secondary)] mb-1">COMPONENT ERROR</p>
          <p className="text-sm text-[var(--color-text-tertiary)] max-w-xs mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button variant="secondary" size="sm" onClick={this.handleRetry}>
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
