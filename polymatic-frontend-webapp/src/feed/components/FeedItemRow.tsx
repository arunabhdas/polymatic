import type { FeedItem } from "../../types/feed"
import { Badge } from "@/components/ui/badge"
import { Timestamp } from "@/components/base/Timestamp"
import { Chip } from "@/components/base/Chip"
import { SeverityDot } from "@/components/base/SeverityDot"
import { Sparkline } from "@/components/base/Sparkline"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, MessageSquareQuote, Newspaper, TrendingUp, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedItemRowProps {
  item: FeedItem
  className?: string
}

export function FeedItemRow({ item, className }: FeedItemRowProps) {
  // Source icon mapping
  const sourceIcons = {
    twitter: <MessageSquareQuote size={14} className="text-sky-500" />,
    reddit: <MessageSquareQuote size={14} className="text-orange-500" />,
    telegram: <MessageSquareQuote size={14} className="text-blue-400" />,
    news: <Newspaper size={14} className="text-purple-500" />,
    structured: <Activity size={14} className="text-emerald-500" />,
    market_signal: <TrendingUp size={14} className="text-amber-500" />
  }

  // Generate some fake sparkline data based on severity
  const sparklineData = Array.from({ length: 15 }, () => 
    Math.max(10, Math.random() * 100 * (item.severity / 100))
  )

  const sparklineColor = item.severity > 70 ? "rose" : item.severity > 40 ? "emerald" : "blue"

  return (
    <div className={cn(
      "group relative flex gap-4 p-4 border-b border-border-subtle hover:bg-bg-hover transition-colors cursor-pointer",
      className
    )}>
      {/* Selection/Hover indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Left Column: Author/Source Icon */}
      <div className="shrink-0 pt-1">
        {item.author?.avatar ? (
          <Avatar className="size-8 border border-border">
            <AvatarImage src={item.author.avatar} />
            <AvatarFallback className="bg-bg-elevated text-xs font-medium">
              {item.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
            {sourceIcons[item.source]}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        
        {/* Header Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            {item.author && (
              <span className="text-sm font-semibold truncate text-text-primary">
                {item.author.name}
              </span>
            )}
            {item.author?.handle && (
              <span className="text-xs text-text-tertiary truncate">
                {item.author.handle}
              </span>
            )}
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-1.5 h-4 opacity-70">
              {item.source.replace("_", " ")}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {item.marketCorrelation && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="opacity-50">Correl:</span>
                <span className="font-mono text-emerald-500">{(item.marketCorrelation * 100).toFixed(0)}%</span>
              </div>
            )}
            <Timestamp date={item.timestamp} />
            <SeverityDot severity={item.severity} pulse={item.severity >= 80} />
          </div>
        </div>

        {/* Content Body */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 group-hover:text-text-primary transition-colors">
          {item.content}
        </p>

        {/* Footer: Entities & Trends */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center flex-wrap gap-2">
            {item.sentimentStance && (
              <Badge 
                variant={item.sentimentStance === "bullish" ? "success" : item.sentimentStance === "bearish" ? "danger" : "secondary"}
                className="text-[10px] uppercase h-5"
              >
                {item.sentimentStance}
              </Badge>
            )}
            
            {item.trendIds.slice(0, 2).map(trend => (
              <Chip 
                key={trend} 
                label={trend.replace("trn-", "")} 
                color="blue" 
                icon={<Hash size={10} />}
              />
            ))}
            
            {item.entities.slice(0, 2).map(entity => (
              <Chip 
                key={entity.id} 
                label={entity.name} 
                color="default" 
              />
            ))}
            
            {(item.entities.length > 2 || item.trendIds.length > 2) && (
              <span className="text-xs text-text-tertiary font-medium">
                +{Math.max(0, item.entities.length - 2) + Math.max(0, item.trendIds.length - 2)}
              </span>
            )}
          </div>
          
          {/* Right side data visual */}
          <div className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={sparklineData} color={sparklineColor} width={60} height={20} />
          </div>
        </div>
        
      </div>
    </div>
  )
}
