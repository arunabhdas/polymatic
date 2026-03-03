import { cn } from '@/lib/cn'

type SkeletonVariant = 'card' | 'list-row' | 'chart' | 'text-block'

interface LoadingSkeletonProps {
  variant?: SkeletonVariant
  count?: number
  className?: string
}

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-[var(--color-bg-hover)]',
        className,
      )}
    />
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-3">
      <Pulse className="h-3 w-24" />
      <Pulse className="h-4 w-full" />
      <Pulse className="h-4 w-3/4" />
      <div className="flex gap-2 pt-1">
        <Pulse className="h-5 w-16 rounded-full" />
        <Pulse className="h-5 w-12 rounded-full" />
      </div>
    </div>
  )
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <Pulse className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Pulse className="h-3 w-3/4" />
        <Pulse className="h-3 w-1/2" />
      </div>
      <Pulse className="h-6 w-16" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-2">
      <Pulse className="h-3 w-20" />
      <Pulse className="h-32 w-full rounded-lg" />
    </div>
  )
}

function TextBlockSkeleton() {
  return (
    <div className="space-y-2">
      <Pulse className="h-3 w-full" />
      <Pulse className="h-3 w-5/6" />
      <Pulse className="h-3 w-4/6" />
    </div>
  )
}

const variants: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  'list-row': ListRowSkeleton,
  chart: ChartSkeleton,
  'text-block': TextBlockSkeleton,
}

export function LoadingSkeleton({ variant = 'card', count = 1, className }: LoadingSkeletonProps) {
  const Component = variants[variant]

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}
