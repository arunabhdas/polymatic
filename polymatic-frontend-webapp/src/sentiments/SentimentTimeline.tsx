import {
  Line,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from 'recharts'
import { cn } from '@/lib/cn'
import type { AggregateScore } from '@/types'

interface SentimentTimelineProps {
  scoreHistory: AggregateScore[]
  height?: number
  className?: string
}

export function SentimentTimeline({ scoreHistory, height = 120, className }: SentimentTimelineProps) {
  const chartData = scoreHistory.map((point, i) => ({
    index: i,
    score: point.score,
    time: new Date(point.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }))

  if (chartData.length === 0) return null

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="score"
            fill="url(#sentimentFill)"
            stroke="none"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { time: string } }> }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md bg-[var(--color-bg-card)] border border-[var(--color-border)] px-2.5 py-1.5 shadow-lg">
      <p className="font-mono text-xs text-[var(--color-accent)] font-medium">
        {payload[0].value}%
      </p>
      <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
        {payload[0].payload.time}
      </p>
    </div>
  )
}
