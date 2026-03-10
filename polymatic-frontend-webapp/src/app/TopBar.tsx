import { PanelRightClose } from "lucide-react"

export function TopBar() {
  return (
    <header className="h-12 flex items-center justify-between bg-background border-b border-border px-4">
      <div className="flex items-center text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer transition-colors duration-150">PolyMatic</span>
        <span className="mx-1.5 text-border">/</span>
        <span className="hover:text-foreground cursor-pointer transition-colors duration-150">Markets</span>
        <span className="mx-1.5 text-border">/</span>
        <span className="text-foreground font-medium">NVIDIA Q4 Earnings</span>
      </div>

      <button className="text-muted-foreground hover:text-foreground transition-colors duration-150 p-1.5 rounded-md hover:bg-accent/50">
        <PanelRightClose size={16} />
      </button>
    </header>
  )
}
