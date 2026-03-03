import { useUIStore } from '@/state/uiStore'
import { cn } from '@/lib/cn'
import { Layers } from 'lucide-react'
import { ViewAllTrends } from '@/trends/ViewAllTrends'
import { TrendDetail } from '@/trends/TrendDetail'

const FULL_HEIGHT_PANELS = new Set(['trends-list', 'trend-detail'])

export function RightPanel() {
  const content = useUIStore((s) => s.rightPanelContent)

  return (
    <aside
      className={cn(
        'h-full overflow-y-auto',
        'bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)]',
        !FULL_HEIGHT_PANELS.has(content.kind) && 'p-4',
      )}
    >
      {content.kind === 'empty' && <RightPanelEmpty />}
      {content.kind === 'feed-detail' && (
        <div className="data-label text-[var(--color-text-tertiary)]">
          Signal detail — {content.itemId}
        </div>
      )}
      {content.kind === 'market-detail' && (
        <div className="data-label text-[var(--color-text-tertiary)]">
          Market detail — {content.marketId}
        </div>
      )}
      {content.kind === 'sentiment-detail' && (
        <div className="data-label text-[var(--color-text-tertiary)]">
          Sentiment detail — {content.questionId}
        </div>
      )}
      {content.kind === 'trend-detail' && (
        <TrendDetail trendId={content.trendId} />
      )}
      {content.kind === 'trends-list' && <ViewAllTrends />}
    </aside>
  )
}

function RightPanelEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <Layers size={32} className="text-[var(--color-text-tertiary)]" />
      <p className="data-label text-[var(--color-text-tertiary)]">Intelligence Panel</p>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-[200px]">
        Select a signal, market, or trend to view detailed analysis
      </p>
    </div>
  )
}
