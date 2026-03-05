import { cn } from "@/lib/utils"

interface ProbabilityDisplayProps {
  value: number // 0 to 1
  label?: string
  className?: string
}

export function ProbabilityDisplay({ value, label, className }: ProbabilityDisplayProps) {
  const percentage = Math.round(value * 100)
  
  // Decide color scale
  const colorClass = percentage > 80 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                     percentage > 50 ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" :
                     percentage > 20 ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" :
                     "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.3)]"

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
         <div className="flex justify-between items-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground leading-none">
           <span>{label}</span>
           <span className={cn("font-mono font-bold tracking-tight", percentage > 80 ? "text-emerald-500" : percentage > 50 ? "text-blue-500" : "text-orange-500")}>
             {percentage}%
           </span>
         </div>
      )}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div className={cn("h-full rounded-full transition-all duration-500", colorClass)} style={{ width: `${percentage}%` }} />
        </div>
        {!label && (
          <span className={cn("text-xs font-mono font-bold tracking-tight", percentage > 80 ? "text-emerald-500" : percentage > 50 ? "text-blue-500" : "text-orange-500")}>
            {percentage}%
          </span>
        )}
      </div>
    </div>
  )
}
