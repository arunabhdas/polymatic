import { Link } from 'react-router-dom'

export default function LandingView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center max-w-lg mx-auto px-6">
        <h1 className="font-mono font-bold text-4xl tracking-wider text-[var(--color-accent)] mb-4">
          POLYMATIC
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-2">
          AI-Powered Geospatial OSINT &amp; Prediction Market Intelligence
        </p>
        <p className="text-[var(--color-text-tertiary)] text-sm mb-8">
          Aggregate signals. Analyze sentiment. Predict outcomes.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Access Terminal
        </Link>
      </div>
    </div>
  )
}
