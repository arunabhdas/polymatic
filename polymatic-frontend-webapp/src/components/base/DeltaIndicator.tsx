import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeltaIndicatorProps {
  value: number
  format?: "percent" | "currency" | "number"
  className?: string
  showIcon?: boolean
}

export function DeltaIndicator({ value, format = "percent", className, showIcon = true }: DeltaIndicatorProps) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  const formattedValue = Math.abs(value).toLocaleString("en-US", {
    style: format === "percent" ? "percent" : format === "currency" ? "currency" : "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    currency: "USD"
  })

  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-sm font-medium font-mono tabular-nums",
      isPositive && "text-emerald-500",
      isNegative && "text-destructive",
      isNeutral && "text-muted-foreground",
      className
    )}>
      {showIcon && isPositive && <TrendingUp size={14} />}
      {showIcon && isNegative && <TrendingDown size={14} />}
      {showIcon && isNeutral && <Minus size={14} />}
      {isPositive ? "+" : isNegative ? "-" : ""}{formattedValue}
    </span>
  )
}
