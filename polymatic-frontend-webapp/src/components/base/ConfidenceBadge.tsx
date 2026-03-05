import { cn } from "@/lib/utils"

interface ConfidenceBadgeProps {
  level: "low" | "medium" | "high"
  className?: string
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  const config = {
    low: {
      label: "Low Confidence",
      className: "border-border text-muted-foreground opacity-60 bg-transparent",
    },
    medium: {
      label: "Med Confidence",
      className: "border-transparent text-foreground bg-white/10 dark:bg-white/15 opacity-85",
    },
    high: {
      label: "High Confidence",
      className: "border-transparent text-foreground bg-white/20 dark:bg-white/25 shadow-[0_0_10px_rgba(255,255,255,0.05)]",
    }
  }

  const { label, className: variantClass } = config[level]

  return (
    <div className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium uppercase tracking-widest leading-none whitespace-nowrap transition-all",
      variantClass,
      className
    )}>
      {label}
    </div>
  )
}
