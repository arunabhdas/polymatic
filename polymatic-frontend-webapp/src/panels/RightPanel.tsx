import { Info, MessageSquare, Activity } from "lucide-react"

export function RightPanel() {
  return (
    <aside className="w-80 flex-shrink-0 border-l border-border bg-background flex flex-col">
      <div className="h-12 flex items-center px-4 border-b border-border text-sm font-medium text-foreground">
        Details
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Overview Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-medium mb-4 text-foreground">
            <Info size={14} className="text-muted-foreground" /> Overview
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Correlation ID</span>
              <span className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded w-fit border border-border">NVDA-Q4-88A2</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Confidence Score</span>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]" />
                </div>
                <span className="text-sm font-mono font-medium text-emerald-500">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium mb-4 text-foreground">
            <Activity size={14} className="text-muted-foreground" /> Activity
          </div>
          <div className="text-xs text-muted-foreground space-y-5">
            <div className="flex gap-3 relative">
              <div className="absolute left-1 top-3 bottom-[-16px] w-px bg-border" />
              <div className="mt-1 size-2 rounded-full bg-blue-500 flex-shrink-0 relative z-10 ring-3 ring-background" />
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground/80 leading-snug">Sentiment shifted <span className="text-emerald-500 font-medium">+4%</span> across 5 primary sources</p>
                <span className="text-[10px] text-muted-foreground font-mono">10:42 AM</span>
              </div>
            </div>
            <div className="flex gap-3 relative">
              <div className="mt-1 size-2 rounded-full bg-orange-500 flex-shrink-0 relative z-10 ring-3 ring-background" />
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground/80 leading-snug">Whale alert: 50k calls bought on unusual volume</p>
                <span className="text-[10px] text-muted-foreground font-mono">10:39 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <div className="relative group">
          <MessageSquare size={14} className="absolute left-3 top-1/2 -mt-[7px] text-muted-foreground group-focus-within:text-foreground transition-colors duration-150" />
          <input
            type="text"
            placeholder="Add note or query..."
            className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-150"
          />
        </div>
      </div>
    </aside>
  )
}
