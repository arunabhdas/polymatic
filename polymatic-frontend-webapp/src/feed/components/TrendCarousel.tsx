import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
    <div className="py-3 border-b border-border">
      <div className="px-5 mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Trending</span>
      </div>

      <ScrollArea className="w-full whitespace-nowrap px-5">
        <div className="flex w-max space-x-3 pb-2">
          {hotTrends.map((trend) => (
            <div
              key={trend.id}
              className="w-[220px] shrink-0 p-3 rounded-md bg-card border border-border hover:border-muted-foreground/20 transition-colors duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[120px]">
                  {trend.id.replace("trn-", "")}
                </span>
                <span className={`text-xs font-mono font-medium ${trend.velocity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {trend.velocity > 0 ? '+' : ''}{trend.velocity}%
                </span>
              </div>

              <h4 className="font-medium text-sm text-foreground truncate mb-1">
                {trend.title}
              </h4>

              <div className="text-[11px] text-muted-foreground font-mono">
                {(trend.volume / 1000).toFixed(1)}k signals / 24h
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible hover:visible" />
      </ScrollArea>
    </div>
  )
}
