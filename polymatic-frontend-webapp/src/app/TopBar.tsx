import { ChevronRight, PanelRightClose } from "lucide-react"

export function TopBar() {
  return (
    <header className="h-14 py-2 mr-2 flex items-center justify-between bg-background z-10 sticky top-0">
      <div className="flex items-center text-sm text-muted-foreground ml-3">
        <span className="hover:text-foreground cursor-pointer transition-colors">PolyMatic</span>
        <ChevronRight size={14} className="mx-1" />
        <span className="hover:text-foreground cursor-pointer transition-colors">Markets</span>
        <ChevronRight size={14} className="mx-1" />
        <span className="text-foreground font-medium">NVIDIA Q4 Earnings</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-xs font-medium text-muted-foreground border border-border px-2 py-1 rounded-md bg-secondary/30">
          02 / 145 Active Events
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-white/5">
          <PanelRightClose size={18} />
        </button>
      </div>
    </header>
  )
}
