import { cn } from '@/lib/cn'

interface DataLabelProps {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3'
  mono?: boolean
}

export function DataLabel({ children, className, as: Tag = 'span', mono }: DataLabelProps) {
  return <Tag className={cn(mono ? 'mono-data' : 'data-label', className)}>{children}</Tag>
}
