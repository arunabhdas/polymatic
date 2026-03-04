import { cn } from '@/lib/cn'
import { SearchResultItem } from './SearchResultItem'
import type { FlattenedResult, SearchResultType } from './search.utils'
import { getSectionLabel, getSectionIcon, getSectionEmptyMessage } from './search.utils'

interface SearchSectionProps {
  type: SearchResultType
  results: FlattenedResult[]
  activeIndex: number | null
  baseIndex: number
  onSelect: (result: FlattenedResult) => void
  showEmpty?: boolean
}

export function SearchSection({
  type,
  results,
  activeIndex,
  baseIndex,
  onSelect,
  showEmpty = false,
}: SearchSectionProps) {
  if (results.length === 0 && !showEmpty) return null

  const Icon = getSectionIcon(type)
  const label = getSectionLabel(type)

  return (
    <div>
      <div className="flex items-center gap-1.5 px-3 py-1.5">
        <Icon size={12} className="text-[var(--color-text-tertiary)]" />
        <span className="data-label text-xs text-[var(--color-text-tertiary)]">{label}</span>
      </div>

      {results.length > 0 ? (
        results.map((result, i) => (
          <SearchResultItem
            key={result.id}
            result={result}
            isActive={activeIndex === baseIndex + i}
            onClick={() => onSelect(result)}
          />
        ))
      ) : (
        <div className={cn('px-3 py-2 text-xs text-[var(--color-text-tertiary)] italic')}>
          {getSectionEmptyMessage(type)}
        </div>
      )}
    </div>
  )
}
