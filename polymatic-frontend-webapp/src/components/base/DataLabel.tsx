interface DataLabelProps {
  label: string
  value: React.ReactNode
  vertical?: boolean
  className?: string
}

export function DataLabel({ label, value, vertical = true, className = "" }: DataLabelProps) {
  return (
    <div className={`flex ${vertical ? 'flex-col gap-1' : 'items-center justify-between'} ${className}`}>
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest leading-none">
        {label}
      </span>
      <div className="text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  )
}
