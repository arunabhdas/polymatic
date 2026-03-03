import { cn } from '@/lib/cn'

interface MonoLabelProps {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3'
}

export function MonoLabel({ children, className, as: Tag = 'span' }: MonoLabelProps) {
  return <Tag className={cn('mono-label', className)}>{children}</Tag>
}
