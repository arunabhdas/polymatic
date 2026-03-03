import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/cn'

interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ items, value, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
      <RadixTabs.List className="flex border-b border-[var(--color-border)]">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
              'data-[state=active]:text-[var(--color-accent)]',
              'focus-visible:outline-none',
            )}
          >
            {item.label}
            <span
              className={cn(
                'absolute bottom-0 left-0 right-0 h-0.5 transition-colors',
                'data-[state=active]:bg-[var(--color-accent)]',
              )}
              data-state={value === item.value ? 'active' : 'inactive'}
            />
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  )
}

export function TabContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <RadixTabs.Content value={value} className={cn('focus-visible:outline-none', className)}>
      {children}
    </RadixTabs.Content>
  )
}
