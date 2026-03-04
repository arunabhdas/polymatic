import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/ui/skeleton'

type SkeletonVariant = 'card' | 'list-row' | 'chart' | 'text-block'

interface LoadingSkeletonProps {
  variant?: SkeletonVariant
  count?: number
  className?: string
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  )
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-4">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  )
}

function TextBlockSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
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
