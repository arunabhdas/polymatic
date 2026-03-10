import { useFeedStore } from "../state/feedStore"
import { FeedFilters } from "./components/FeedFilters"
import { TrendCarousel } from "./components/TrendCarousel"
import { FeedItemRow } from "./components/FeedItemRow"
import { Virtuoso } from "react-virtuoso"
import { Activity } from "lucide-react"

export default function HomeFeed() {
  const { filteredItems } = useFeedStore()
  const items = filteredItems()

  return (
    <div className="flex flex-col h-full bg-background">
      <FeedFilters />
      <TrendCarousel />

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <Activity size={32} className="opacity-20" />
          <p className="text-sm">No activity matches your filters.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <Virtuoso
            data={items}
            itemContent={(_, item) => <FeedItemRow item={item} />}
            className="h-full scrollbar-none"
            initialTopMostItemIndex={0}
          />
        </div>
      )}
    </div>
  )
}
