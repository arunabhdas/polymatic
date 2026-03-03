import { useUIStore } from '@/state/uiStore'
import { cn } from '@/lib/cn'
import { Layers } from 'lucide-react'

export function RightPanel() {
  const content = useUIStore((s) => s.rightPanelContent)

  return (
    <aside
      className={cn(
        'h-full overflow-y-auto',
        'bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)]',
        'p-4',
      )}
    >
      {content.kind === 'empty' && <RightPanelEmpty />}
      {content.kind === 'feed-detail' && (
        <div className="mono-label text-[var(--color-text-tertiary)]">
          SIGNAL DETAIL — {content.itemId}
        </div>
      )}
      {content.kind === 'market-detail' && (
        <div className="mono-label text-[var(--color-text-tertiary)]">
          MARKET DETAIL — {content.marketId}
        </div>
      )}
      {content.kind === 'sentiment-detail' && (
        <div className="mono-label text-[var(--color-text-tertiary)]">
          SENTIMENT DETAIL — {content.questionId}
        </div>
      )}
      {content.kind === 'trend-detail' && (
        <div className="mono-label text-[var(--color-text-tertiary)]">
          TREND DETAIL — {content.trendId}
        </div>
      )}
    </aside>
  )
}

function RightPanelEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <Layers size={32} className="text-[var(--color-text-tertiary)]" />
      <p className="mono-label text-[var(--color-text-tertiary)]">INTELLIGENCE PANEL</p>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-[200px]">
        Select a signal, market, or trend to view detailed analysis
      </p>
    </div>
  )
}
