import { cn } from '@/lib/cn'

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-[var(--color-bg-hover)]', className)} />
  )
}

function CompactSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]/50">
      <Pulse className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Pulse className="h-3 w-3/4" />
        <div className="flex gap-2">
          <Pulse className="h-4 w-14 rounded-full" />
          <Pulse className="h-4 w-10 rounded-full" />
        </div>
      </div>
      <Pulse className="h-3 w-12" />
    </div>
  )
}

function ExpandedSkeleton() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Pulse className="h-8 w-8 rounded-full shrink-0" />
        <Pulse className="h-3 w-24" />
        <Pulse className="h-3 w-16 ml-auto" />
      </div>
      <Pulse className="h-4 w-full" />
      <Pulse className="h-4 w-5/6" />
      <Pulse className="h-3 w-2/3" />
      <div className="flex gap-2 pt-1">
        <Pulse className="h-5 w-16 rounded-full" />
        <Pulse className="h-5 w-20 rounded-full" />
        <Pulse className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Pulse className="h-4 w-4 rounded" />
        <Pulse className="h-4 w-4 rounded" />
        <Pulse className="h-4 w-4 rounded" />
      </div>
    </div>
  )
}

/** Mixed-height skeleton matching real feed layout */
const skeletonPattern = [
  ExpandedSkeleton,
  CompactSkeleton,
  CompactSkeleton,
  ExpandedSkeleton,
  CompactSkeleton,
  ExpandedSkeleton,
  CompactSkeleton,
] as const

export function FeedSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2 p-2', className)}>
      {skeletonPattern.map((Component, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}
