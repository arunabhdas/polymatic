import { Link } from "react-router-dom"
import { 
  BarChart2, 
  Search, 
  Home, 
  TrendingUp, 
  Globe, 
  Settings,
  Plus
} from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Workspace Header */}
      <div className="h-14 flex items-center px-4 border-b border-border/40">
        <div className="flex items-center gap-2 font-semibold">
          <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">P</div>
          PolyMatic
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        
        {/* Main Nav */}
        <div className="flex flex-col gap-1">
          <NavItem icon={<Home size={16} />} label="Home" to="/" />
          <NavItem icon={<Search size={16} />} label="Search" shortcut="⌘K" to="/search" />
          <NavItem icon={<TrendingUp size={16} />} label="Trends" to="/trends" />
          <NavItem icon={<BarChart2 size={16} />} label="Markets" to="/markets" />
          <NavItem icon={<Globe size={16} />} label="Geo View" to="/geo" />
        </div>

        {/* Favorites */}
        <div className="flex flex-col gap-1">
          <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex justify-between items-center group">
            Favorites
            <Plus size={14} className="cursor-pointer hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <NavItem icon={<span className="size-2 rounded-full bg-blue-500" />} label="Nvidia Earnings" to="/markets/nvda" />
          <NavItem icon={<span className="size-2 rounded-full bg-orange-500" />} label="OpenAI DevDay" to="/events/openai" />
          <NavItem icon={<span className="size-2 rounded-full bg-purple-500" />} label="Federal Reserve" to="/macro/fed" />
        </div>
        
      </div>

      {/* Footer Nav */}
      <div className="p-3 border-t border-border/40">
        <NavItem icon={<Settings size={16} />} label="Settings" to="/settings" />
        <div className="mt-2 flex items-center gap-3 px-2 py-1.5 cursor-pointer rounded-md hover:bg-white/5">
          <div className="size-8 rounded-full bg-muted border border-border" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Quant User</span>
            <span className="text-xs text-muted-foreground">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, shortcut, to }: { icon: React.ReactNode, label: string, shortcut?: string, to: string }) {
  return (
    <Link to={to} className="flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors group">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {shortcut && (
        <span className="text-xs text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded border border-white/10 group-hover:border-white/20 transition-colors">
          {shortcut}
        </span>
      )}
    </Link>
  )
}
