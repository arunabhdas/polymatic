import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/app/AppShell'
import { AuthGuard } from '@/auth/AuthGuard'
import { FeatureGate } from '@/components/FeatureGate'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

const LandingView = lazy(() => import('@/views/LandingView'))
const LoginView = lazy(() => import('@/views/LoginView'))
const HomeView = lazy(() => import('@/views/HomeView'))
const SentimentsView = lazy(() => import('@/views/SentimentsView'))
const GeoView = lazy(() => import('@/views/GeoView'))
const MarketsView = lazy(() => import('@/views/MarketsView'))
const TopicPageView = lazy(() => import('@/views/TopicPageView'))
const SearchResultsView = lazy(() => import('@/views/SearchResultsView'))
const AlertsConfigView = lazy(() => import('@/views/AlertsConfigView'))
const OnboardingView = lazy(() => import('@/views/OnboardingView'))

function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <LoadingSkeleton variant="card" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LandingView />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LoginView />
      </Suspense>
    ),
  },
  {
    path: '/app',
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/app/home" replace /> },
      {
        path: 'home',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <HomeView />
          </Suspense>
        ),
      },
      {
        path: 'sentiments',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <SentimentsView />
          </Suspense>
        ),
      },
      {
        path: 'sentiments/:questionId',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <SentimentsView />
          </Suspense>
        ),
      },
      {
        path: 'geo',
        element: (
          <FeatureGate flag="enableGeoView" fallback={<Navigate to="/app/home" replace />}>
            <Suspense fallback={<SuspenseFallback />}>
              <GeoView />
            </Suspense>
          </FeatureGate>
        ),
      },
      {
        path: 'markets',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <MarketsView />
          </Suspense>
        ),
      },
      {
        path: 'markets/:marketId',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <MarketsView />
          </Suspense>
        ),
      },
      {
        path: 'topic/:trendId',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <TopicPageView />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <SearchResultsView />
          </Suspense>
        ),
      },
      {
        path: 'alerts',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AlertsConfigView />
          </Suspense>
        ),
      },
      {
        path: 'onboarding',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <OnboardingView />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function App() {
  return <RouterProvider router={router} />
}
