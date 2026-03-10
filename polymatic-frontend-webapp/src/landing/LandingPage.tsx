import { lazy, Suspense, Component, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { HeroSection } from "./components/HeroSection"
import { FeatureHighlights } from "./components/FeatureHighlights"

const GlobeCanvas = lazy(() =>
  import("./components/GlobeCanvas").then((m) => ({ default: m.GlobeCanvas }))
)

// Graceful fallback if WebGL fails
class GlobeErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null // Globe simply disappears
    return this.props.children
  }
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Globe background */}
      <div className="absolute inset-0 z-0">
        <GlobeErrorBoundary>
          <Suspense fallback={null}>
            <GlobeCanvas />
          </Suspense>
        </GlobeErrorBoundary>
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/80 via-background/20 to-background" />

      {/* Content layer */}
      <div className="relative z-[2] flex flex-col min-h-screen">
        {/* Nav bar */}
        <nav className="flex items-center justify-between px-6 lg:px-10 h-14 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              P
            </div>
            PolyMatic
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* Hero — centered over globe */}
        <div className="flex-1 flex items-center justify-center pt-8 pb-16">
          <HeroSection />
        </div>

        {/* Feature cards */}
        <div className="pb-20">
          <FeatureHighlights />
        </div>

        {/* Minimal footer */}
        <footer className="flex items-center justify-center pb-8 text-xs text-muted-foreground/40">
          &copy; {new Date().getFullYear()} PolyMatic. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
