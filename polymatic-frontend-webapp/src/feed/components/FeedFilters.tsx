import { useFeedStore } from "../../state/feedStore"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { SourceType } from "../../types/feed"
import { SlidersHorizontal, Activity, TrendingUp, Presentation, Newspaper } from "lucide-react"
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
    <div className="flex items-center gap-4 py-3 px-6 border-b border-border/40 bg-bg-primary/50 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-2 text-muted-foreground mr-2">
        <SlidersHorizontal size={14} />
        <span className="text-xs font-medium uppercase tracking-widest">Feed</span>
      </div>

      <Separator orientation="vertical" className="h-4" />

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          <Badge 
            variant={isAll ? "secondary" : "outline"} 
            className="cursor-pointer transition-all hover:scale-105 active:scale-95"
            onClick={() => setFilter("sources", [])}
          >
            All Activity
          </Badge>
          <Badge 
            variant={filters.sources.includes("market_signal") ? "secondary" : "outline"} 
            className="cursor-pointer transition-all hover:scale-105 active:scale-95 gap-1.5"
            onClick={() => toggleSource("market_signal")}
          >
            <TrendingUp size={12} className={cn(filters.sources.includes("market_signal") ? "text-emerald-500" : "")} />
            Market Signals
          </Badge>
          <Badge 
            variant={filters.sources.includes("structured") ? "secondary" : "outline"} 
            className="cursor-pointer transition-all hover:scale-105 active:scale-95 gap-1.5"
            onClick={() => toggleSource("structured")}
          >
            <Activity size={12} className={cn(filters.sources.includes("structured") ? "text-blue-500" : "")} />
            On-Chain
          </Badge>
          <Badge 
            variant={filters.sources.includes("news") ? "secondary" : "outline"} 
            className="cursor-pointer transition-all hover:scale-105 active:scale-95 gap-1.5"
            onClick={() => toggleSource("news")}
          >
            <Newspaper size={12} className={cn(filters.sources.includes("news") ? "text-purple-500" : "")} />
            News
          </Badge>
          <Badge 
            variant={filters.sources.includes("twitter") ? "secondary" : "outline"} 
            className="cursor-pointer transition-all hover:scale-105 active:scale-95 gap-1.5"
            onClick={() => toggleSource("twitter")}
          >
            <Presentation size={12} className={cn(filters.sources.includes("twitter") ? "text-sky-500" : "")} />
            Social
          </Badge>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
