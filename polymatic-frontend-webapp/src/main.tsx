import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AppShell } from './app/AppShell'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <div className="p-8">
            <h1 className="text-3xl font-semibold mb-2 text-foreground tracking-tight">Home Feed</h1>
            <p className="text-muted-foreground text-sm">Feed content and dynamic modules will load here...</p>
          </div>
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
        element: <div className="p-8 text-muted-foreground">Geo View (Cesium)</div>
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
