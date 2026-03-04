import { motion } from 'framer-motion'
import { isHighSignal } from './feed.utils'
import { FeedCardCompact } from './FeedCardCompact'
import { FeedCardExpanded } from './FeedCardExpanded'
import { useFeedStore } from '@/state/feedStore'
import { useUIStore } from '@/state/uiStore'
import type { FeedItem } from '@/types'

interface FeedCardProps {
  item: FeedItem
}

export function FeedCard({ item }: FeedCardProps) {
  const selectItem = useFeedStore((s) => s.selectItem)
  const setRightPanelContent = useUIStore((s) => s.setRightPanelContent)

  const handleClick = () => {
    selectItem(item.id)
    setRightPanelContent({ kind: 'feed-detail', itemId: item.id })
  }

  const expanded = isHighSignal(item)

  return (
    <motion.div layout transition={{ duration: 0.2, ease: 'easeOut' }}>
      {expanded ? (
        <FeedCardExpanded item={item} onClick={handleClick} />
      ) : (
        <FeedCardCompact item={item} onClick={handleClick} />
      )}
    </motion.div>
  )
}
