import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { FeedCardExpanded } from './FeedCardExpanded'
import { FeedCardCompact } from './FeedCardCompact'
import { useFeedStore } from '@/state/feedStore'
import { useUIStore } from '@/state/uiStore'
import type { FeedCluster as FeedClusterType, FeedItem } from '@/types'

interface FeedClusterProps {
  cluster: FeedClusterType
  items: FeedItem[]
}

export function FeedCluster({ cluster, items }: FeedClusterProps) {
  const [expanded, setExpanded] = useState(false)
  const selectItem = useFeedStore((s) => s.selectItem)
  const setRightPanelContent = useUIStore((s) => s.setRightPanelContent)

  const leadItem = items.find((i) => i.id === cluster.leadItemId)
  const restItems = items.filter((i) => i.id !== cluster.leadItemId)

  if (!leadItem) return null

  const handleItemClick = (id: string) => {
    selectItem(id)
    setRightPanelContent({ kind: 'feed-detail', itemId: id })
  }

  return (
    <div className="space-y-1">
      {/* Lead card — always expanded */}
      <FeedCardExpanded
        item={leadItem}
        onClick={() => handleItemClick(leadItem.id)}
      />

      {/* Cluster toggle */}
      {restItems.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 w-full',
              'text-xs text-[var(--color-text-tertiary)]',
              'hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]',
              'transition-colors duration-100 rounded',
            )}
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.span>
            {restItems.length} more from this story
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="space-y-0.5 pl-4 border-l-2 border-[var(--color-border)]/50 ml-4">
                  {restItems.map((item) => (
                    <FeedCardCompact
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
