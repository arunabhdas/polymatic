import {
  Tooltip as ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider as ShadcnTooltipProvider,
} from '@/components/ui/tooltip'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <ShadcnTooltipProvider delayDuration={300}>{children}</ShadcnTooltipProvider>
}

export function Tooltip({ content, children, side = 'top', delayDuration }: TooltipProps) {
  return (
    <ShadcnTooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={4}>
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  )
}
