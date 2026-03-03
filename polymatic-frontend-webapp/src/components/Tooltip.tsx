import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <RadixTooltip.Provider delayDuration={300}>{children}</RadixTooltip.Provider>
}

export function Tooltip({ content, children, side = 'top', delayDuration }: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={4}
          className={cn(
            'z-50 px-3 py-1.5 rounded-md text-xs',
            'bg-[var(--color-bg-card)] border border-[var(--color-border)]',
            'text-[var(--color-text-primary)] shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-[var(--color-bg-card)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
