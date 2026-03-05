import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Hash } from "lucide-react"

// Mock hot trends
const hotTrends = [
  { id: "trn-fed-rates", title: "Fed Rates Nov 2026", velocity: 45, volume: 12500 },
  { id: "trn-semi-earnings", title: "Semiconductor Q3", velocity: -12, volume: 8400 },
  { id: "trn-oil-supply", title: "OPEC+ Supply Restraints", velocity: 88, volume: 32000 },
  { id: "trn-defi-gov", title: "DeFi Protocol Votes", velocity: 5, volume: 1200 },
  { id: "trn-crypto-vol", title: "Stablecoin Outflows", velocity: 120, volume: 45000 },
  { id: "trn-ai-safety", title: "EU AI Safety Board", velocity: 22, volume: 5600 },
]

export function TrendCarousel() {
  return (
    <div className="py-4 border-b border-border/40 bg-bg-secondary/30">
      <div className="px-6 mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <span>Trending Topics</span>
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        </h3>
        <span className="text-xs text-text-tertiary uppercase tracking-widest font-medium">Real-time</span>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap px-6">
        <div className="flex w-max space-x-4 pb-4">
          {hotTrends.map((trend) => (
            <Card 
              key={trend.id} 
              className="w-[240px] shrink-0 p-3 hover:shadow-sm hover:border-border-strong transition-all cursor-pointer bg-bg-card active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Hash size={14} className="opacity-70" />
                  <span className="text-xs font-mono truncate max-w-[120px]">{trend.id.replace("trn-", "")}</span>
                </div>
                <span className={`text-xs font-mono font-medium ${trend.velocity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {trend.velocity > 0 ? '+' : ''}{trend.velocity}%
                </span>
              </div>
              
              <h4 className="font-semibold text-sm text-text-primary truncate mb-1">
                {trend.title}
              </h4>
              
              <div className="text-xs text-text-tertiary tabular-nums">
                {(trend.volume / 1000).toFixed(1)}k signals / 24h
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible hover:visible" />
      </ScrollArea>
    </div>
  )
}
