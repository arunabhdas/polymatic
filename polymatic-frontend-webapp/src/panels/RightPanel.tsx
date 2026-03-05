import { Info, MessageSquare, Activity } from "lucide-react"

export function RightPanel() {
  return (
    <aside className="w-80 flex-shrink-0 border-l border-border/40 bg-card flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-border/40 font-medium text-sm text-card-foreground">
        Details & Metadata
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mock Metadata Section */}
        <div className="p-4 border-b border-white/5 relative bg-white/[0.01]">
          <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-card-foreground">
            <Info size={16} className="text-muted-foreground" /> Overview
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Correlation ID</span>
              <span className="text-sm font-mono shrink text-card-foreground bg-white/5 px-2 py-1 rounded w-fit border border-white/5">NVDA-Q4-88A2</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Confidence Score</span>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-500 w-[92%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <span className="text-sm font-medium text-emerald-500 tracking-tight">92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Activity Section */}
         <div className="p-4 flex-1 bg-white/[0.005]">
          <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-card-foreground">
            <Activity size={16} className="text-muted-foreground" /> Live Activity
          </div>
          <div className="text-xs text-muted-foreground space-y-5">
            <div className="flex gap-3 relative">
              <div className="absolute left-1 top-3 bottom-[-16px] w-[1px] bg-white/10" />
              <div className="mt-1 size-2 rounded-full bg-blue-500 flex-shrink-0 relative z-10 ring-4 ring-card" />
              <div className="flex flex-col gap-0.5">
                <p className="text-card-foreground/90 leading-snug">Sentiment shifted <span className="text-emerald-500 font-medium">+4%</span> across 5 primary sources</p>
                <span className="text-[10px] opacity-60 font-medium">10:42 AM</span>
              </div>
            </div>
            <div className="flex gap-3 relative">
              <div className="mt-1 size-2 rounded-full bg-orange-500 flex-shrink-0 relative z-10 ring-4 ring-card" />
              <div className="flex flex-col gap-0.5">
                <p className="text-card-foreground/90 leading-snug">Whale alert: 50k calls bought on unusual volume</p>
                <span className="text-[10px] opacity-60 font-medium">10:39 AM</span>
              </div>
            </div>
          </div>
         </div>
      </div>

      <div className="p-3 border-t border-border/40 bg-card">
        <div className="relative group">
          <MessageSquare size={14} className="absolute left-3 top-1/2 -mt-[7px] text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input 
            type="text" 
            placeholder="Add note or query..." 
            className="w-full bg-background border border-border/50 rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-border transition-all shadow-sm"
          />
        </div>
      </div>
    </aside>
  )
}
