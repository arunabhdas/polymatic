import { Link, useLocation } from "react-router-dom"
import {
  BarChart2,
  Search,
  Home,
  TrendingUp,
  Globe,
  Settings,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-background text-foreground">
      {/* Workspace Header */}
      <div className="h-12 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">P</div>
          PolyMatic
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-5">
        <div className="flex flex-col gap-0.5">
          <NavItem icon={<Home size={16} />} label="Home" to="/dashboard" active={location.pathname === "/dashboard"} />
          <NavItem icon={<Search size={16} />} label="Search" shortcut="⌘K" to="/dashboard/search" active={location.pathname.startsWith("/dashboard/search")} />
          <NavItem icon={<TrendingUp size={16} />} label="Trends" to="/dashboard/trends" active={location.pathname.startsWith("/dashboard/trends")} />
          <NavItem icon={<BarChart2 size={16} />} label="Markets" to="/dashboard/markets" active={location.pathname.startsWith("/dashboard/markets")} />
          <NavItem icon={<Globe size={16} />} label="Geo View" to="/dashboard/geo" active={location.pathname.startsWith("/dashboard/geo")} />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="px-2 text-xs font-medium text-muted-foreground mb-1 flex justify-between items-center group">
            Favorites
            <Plus size={14} className="cursor-pointer hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </div>
          <NavItem icon={<span className="size-2 rounded-full bg-blue-500" />} label="Nvidia Earnings" to="/dashboard/markets/nvda" active={false} />
          <NavItem icon={<span className="size-2 rounded-full bg-orange-500" />} label="OpenAI DevDay" to="/dashboard/events/openai" active={false} />
          <NavItem icon={<span className="size-2 rounded-full bg-purple-500" />} label="Federal Reserve" to="/dashboard/macro/fed" active={false} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <NavItem icon={<Settings size={16} />} label="Settings" to="/dashboard/settings" active={location.pathname.startsWith("/dashboard/settings")} />
        <div className="mt-2 flex items-center gap-3 px-2 py-1.5 cursor-pointer rounded-md hover:bg-accent/50 transition-colors duration-150">
          <div className="size-7 rounded-full bg-muted border border-border" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Quant User</span>
            <span className="text-xs text-muted-foreground">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, shortcut, to, active }: { icon: React.ReactNode, label: string, shortcut?: string, to: string, active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors duration-150 group",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("transition-colors duration-150", active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {shortcut && (
        <span className="text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
          {shortcut}
        </span>
      )}
    </Link>
  )
}
