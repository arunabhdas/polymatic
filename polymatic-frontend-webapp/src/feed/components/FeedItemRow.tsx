import type { FeedItem } from "../../types/feed"
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
  const sourceIcons = {
    twitter: <MessageSquareQuote size={13} className="text-sky-500" />,
    reddit: <MessageSquareQuote size={13} className="text-orange-500" />,
    telegram: <MessageSquareQuote size={13} className="text-blue-400" />,
    news: <Newspaper size={13} className="text-purple-500" />,
    structured: <Activity size={13} className="text-emerald-500" />,
    market_signal: <TrendingUp size={13} className="text-amber-500" />
  }

  const sparklineData = Array.from({ length: 15 }, () =>
    Math.max(10, Math.random() * 100 * (item.severity / 100))
  )

  const sparklineColor = item.severity > 70 ? "rose" : item.severity > 40 ? "emerald" : "blue"

  return (
    <div className={cn(
      "group flex gap-3.5 px-5 py-3.5 border-b border-border hover:bg-accent/30 transition-colors duration-150 cursor-pointer",
      className
    )}>
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {item.author?.avatar ? (
          <Avatar className="size-7 border border-border">
            <AvatarImage src={item.author.avatar} />
            <AvatarFallback className="bg-muted text-xs font-medium">
              {item.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-7 rounded-full bg-muted border border-border flex items-center justify-center">
            {sourceIcons[item.source]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            {item.author && (
              <span className="text-sm font-medium truncate text-foreground">
                {item.author.name}
              </span>
            )}
            {item.author?.handle && (
              <span className="text-xs text-muted-foreground truncate">
                {item.author.handle}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {item.source.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {item.marketCorrelation && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-mono text-emerald-500">{(item.marketCorrelation * 100).toFixed(0)}%</span>
              </div>
            )}
            <Timestamp date={item.timestamp} />
            <SeverityDot severity={item.severity} pulse={item.severity >= 80} />
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors duration-150">
          {item.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center flex-wrap gap-1.5">
            {item.sentimentStance && (
              <span className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                item.sentimentStance === "bullish" ? "text-emerald-500 bg-emerald-500/10" :
                item.sentimentStance === "bearish" ? "text-rose-500 bg-rose-500/10" :
                "text-muted-foreground bg-muted"
              )}>
                {item.sentimentStance}
              </span>
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
              <span className="text-[11px] text-muted-foreground">
                +{Math.max(0, item.entities.length - 2) + Math.max(0, item.trendIds.length - 2)}
              </span>
            )}
          </div>

          <div className="shrink-0 opacity-40 group-hover:opacity-80 transition-opacity duration-150">
            <Sparkline data={sparklineData} color={sparklineColor} width={60} height={18} />
          </div>
        </div>
      </div>
    </div>
  )
}
