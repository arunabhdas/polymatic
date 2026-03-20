import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import LandingPage from './components/LandingPage'
import DemoPage from './components/DemoPage'
import App from './App'
import PlatformPage from './components/PlatformPage'
import FeaturesPage from './components/FeaturesPage'
import PricingPage from './components/PricingPage'
import AboutPage from './components/AboutPage'
import BlogPage from './components/BlogPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/demo',
    element: <DemoPage />,
  },
  {
    path: '/dashboard',
    element: <App />,
  },
  {
    path: '/platform',
    element: <PlatformPage />,
  },
  {
    path: '/features',
    element: <FeaturesPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
