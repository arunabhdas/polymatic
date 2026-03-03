import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/cn'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export function Sparkline({
  data,
  color = 'var(--color-accent)',
  height = 32,
  className,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }))

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
