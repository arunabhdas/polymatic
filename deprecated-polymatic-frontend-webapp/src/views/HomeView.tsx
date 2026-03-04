import { useCallback } from 'react'
import { useUIStore } from '@/state/uiStore'
import { TrendingBar } from '@/trends/TrendingBar'
import { FeedFilters } from '@/feed/FeedFilters'
import { FeedContainer } from '@/feed/FeedContainer'

export default function HomeView() {
  const setRightPanelContent = useUIStore((s) => s.setRightPanelContent)

  const handleViewAllTrends = useCallback(() => {
    setRightPanelContent({ kind: 'trends-list' })
  }, [setRightPanelContent])

  return (
    <div className="flex flex-col h-full">
      <TrendingBar onViewAll={handleViewAllTrends} />
      <FeedFilters />
      <FeedContainer className="flex-1" />
    </div>
  )
}
