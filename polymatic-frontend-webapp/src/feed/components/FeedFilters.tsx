import { useFeedStore } from "../../state/feedStore"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { SourceType } from "../../types/feed"
import { Activity, TrendingUp, Presentation, Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"

export function FeedFilters() {
  const { filters, setFilter } = useFeedStore()

  const toggleSource = (source: SourceType) => {
    const current = filters.sources
    if (current.includes(source)) {
      setFilter("sources", current.filter(s => s !== source))
    } else {
      setFilter("sources", [...current, source])
    }
  }

  const isAll = filters.sources.length === 0

  return (
    <div className="flex items-center gap-3 py-2.5 px-5 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-1.5 p-0.5">
          <FilterButton active={isAll} onClick={() => setFilter("sources", [])}>
            All
          </FilterButton>
          <FilterButton
            active={filters.sources.includes("market_signal")}
            onClick={() => toggleSource("market_signal")}
            icon={<TrendingUp size={12} />}
          >
            Markets
          </FilterButton>
          <FilterButton
            active={filters.sources.includes("structured")}
            onClick={() => toggleSource("structured")}
            icon={<Activity size={12} />}
          >
            On-Chain
          </FilterButton>
          <FilterButton
            active={filters.sources.includes("news")}
            onClick={() => toggleSource("news")}
            icon={<Newspaper size={12} />}
          >
            News
          </FilterButton>
          <FilterButton
            active={filters.sources.includes("twitter")}
            onClick={() => toggleSource("twitter")}
            icon={<Presentation size={12} />}
          >
            Social
          </FilterButton>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function FilterButton({ active, onClick, icon, children }: {
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      {icon}
      {children}
    </button>
  )
}
