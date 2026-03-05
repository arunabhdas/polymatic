import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface VelocityIndicatorProps {
  velocity: number // percentage -100 to 100
  className?: string
  size?: "sm" | "md"
}

export function VelocityIndicator({ velocity, className, size = "md" }: VelocityIndicatorProps) {
  const isPositive = velocity > 0
  const isNegative = velocity < 0
  const isNeutral = velocity === 0

  const iconSize = size === "sm" ? 12 : 14
  const textSize = size === "sm" ? "text-xs" : "text-sm"

  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 font-medium font-mono tabular-nums",
      textSize,
      isPositive && "text-emerald-500",
      isNegative && "text-destructive",
      isNeutral && "text-muted-foreground",
      className
    )}>
      {isPositive && <ArrowUpRight strokeWidth={2.5} size={iconSize} />}
      {isNegative && <ArrowDownRight strokeWidth={2.5} size={iconSize} />}
      {isNeutral && <ArrowRight strokeWidth={2.5} size={iconSize} />}
      {Math.abs(velocity)}%
    </span>
  )
}
