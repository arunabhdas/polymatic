import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export function HeroSection() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center max-w-3xl mx-auto px-6"
    >
      <motion.div variants={item} className="mb-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live intelligence feeds active
        </span>
      </motion.div>

      <motion.h1
        variants={item}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
      >
        Real-time Intelligence for{" "}
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Prediction Markets
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
      >
        Aggregate OSINT signals, analyze social sentiment, and correlate with
        prediction markets — all from one intelligence dashboard.
      </motion.p>

      <motion.div variants={item} className="mt-8 flex items-center gap-4">
        <Button size="lg" asChild>
          <Link to="/dashboard" className="gap-2">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="#features">Learn More</a>
        </Button>
      </motion.div>

      <motion.p
        variants={item}
        className="mt-4 text-xs text-muted-foreground/60"
      >
        No credit card required
      </motion.p>
    </motion.div>
  )
}
