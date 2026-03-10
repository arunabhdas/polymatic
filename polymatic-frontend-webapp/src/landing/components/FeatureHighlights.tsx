import { motion } from "framer-motion"
import { Rss, Brain, TrendingUp, Bell } from "lucide-react"

const features = [
  {
    icon: Rss,
    title: "OSINT Aggregation",
    description:
      "Multi-source intelligence feeds from social media, news wires, and government channels — filtered and ranked by signal strength.",
  },
  {
    icon: Brain,
    title: "Sentiment Engine",
    description:
      "AI-powered sentiment analysis on Twitter/X, Reddit, and Telegram. Track how narratives shift prediction market odds in real time.",
  },
  {
    icon: TrendingUp,
    title: "Market Correlation",
    description:
      "Cross-reference OSINT signals with Polymarket and Kalshi contracts. Spot divergences before the market catches up.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description:
      "Custom alert rules on sentiment spikes, volume surges, and geopolitical triggers. Get notified the moment a signal fires.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export function FeatureHighlights() {
  return (
    <motion.div
      id="features"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-6 w-full"
    >
      {features.map((feature) => (
        <motion.div
          key={feature.title}
          variants={item}
          className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-colors duration-200 hover:bg-card/70 hover:border-border/80"
        >
          <div className="mb-4 inline-flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
            <feature.icon size={20} />
          </div>
          <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
