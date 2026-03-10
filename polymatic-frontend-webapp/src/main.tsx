import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AppShell } from "./app/AppShell"

// Lazy load views
const LandingPage = lazy(() => import("./landing/LandingPage"))
const HomeFeed = lazy(() => import("./feed/HomeFeed"))

const LoadingFallback = (
  <div className="flex h-full items-center justify-center">
    <div className="animate-pulse w-8 h-8 rounded-full bg-accent/20" />
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={LoadingFallback}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={LoadingFallback}>
            <HomeFeed />
          </Suspense>
        )
      },
      {
        path: "search",
        element: <div className="p-8 text-muted-foreground">Search Interface</div>
      },
      {
        path: "trends",
        element: <div className="p-8 text-muted-foreground">Trending Topics</div>
      },
      {
        path: "markets",
        element: <div className="p-8 text-muted-foreground">Market Analytics</div>
      },
      {
        path: "geo",
        element: <div className="p-8 text-muted-foreground">Geo View</div>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
)
