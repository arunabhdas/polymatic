import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChipProps {
  label: string
  onRemove?: () => void
  color?: "default" | "blue" | "emerald" | "purple" | "orange"
  className?: string
  icon?: React.ReactNode
}

export function Chip({ label, onRemove, color = "default", className, icon }: ChipProps) {
  const colorStyles = {
    default: "bg-secondary text-secondary-foreground border-border",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap transition-colors",
      colorStyles[color],
      className
    )}>
      {icon && <span className="opacity-70 shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
          className="hover:bg-black/10 dark:hover:bg-white/10 p-0.5 rounded-sm transition-colors opacity-70 hover:opacity-100"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
