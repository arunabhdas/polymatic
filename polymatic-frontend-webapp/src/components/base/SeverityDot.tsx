import { cn } from "@/lib/utils"

interface SeverityDotProps {
  severity: number // 0-100
  className?: string
  pulse?: boolean
}

export function SeverityDot({ severity, className, pulse = false }: SeverityDotProps) {
  let colorClass = "bg-emerald-500"
  let shadowClass = "shadow-[0_0_8px_rgba(16,185,129,0.5)]"

  if (severity >= 67) {
    colorClass = "bg-rose-500"
    shadowClass = "shadow-[0_0_8px_rgba(225,29,72,0.5)]"
  } else if (severity >= 34) {
    colorClass = "bg-amber-500"
    shadowClass = "shadow-[0_0_8px_rgba(245,158,11,0.5)]"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <div 
        className={cn("size-2 rounded-full", colorClass, shadowClass, className)} 
      />
      {pulse && (
        <div 
          className={cn("absolute size-full rounded-full animate-ping opacity-75", colorClass, className)} 
        />
      )}
    </div>
  )
}
