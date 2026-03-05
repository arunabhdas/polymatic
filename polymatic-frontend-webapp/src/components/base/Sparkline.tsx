import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface SparklineProps {
  data: number[]
  color?: "emerald" | "rose" | "blue" | "default"
  className?: string
  width?: number | string
  height?: number | string
}

export function Sparkline({ data, color = "default", className, width = 80, height = 24 }: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }))

  const colorMap = {
    emerald: { stroke: "#10b981", fill: "url(#fillEmerald)" },
    rose: { stroke: "#e11d48", fill: "url(#fillRose)" },
    blue: { stroke: "#3b82f6", fill: "url(#fillBlue)" },
    default: { stroke: "currentColor", fill: "transparent" }
  }

  const { stroke, fill } = colorMap[color]

  return (
    <div className={cn("inline-block", className)} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillEmerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillRose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            fill={fill}
            strokeWidth={1.5}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
