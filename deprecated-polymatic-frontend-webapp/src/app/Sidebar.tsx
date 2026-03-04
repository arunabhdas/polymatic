import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  BarChart3,
  Globe,
  TrendingUp,
  Bell,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLayout } from '@/hooks/useLayout'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { LayoutSwitcher } from './LayoutSwitcher'

interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  featureFlag?: 'enableGeoView'
}

const navItems: NavItem[] = [
  { to: '/app/home', icon: Home, label: 'Home' },
  { to: '/app/sentiments', icon: BarChart3, label: 'Sentiments' },
  { to: '/app/geo', icon: Globe, label: 'Geo', featureFlag: 'enableGeoView' },
  { to: '/app/markets', icon: TrendingUp, label: 'Markets' },
]

const bottomItems: NavItem[] = [
  { to: '/app/alerts', icon: Bell, label: 'Alerts' },
]

interface SidebarProps {
  collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { setSidebarCollapsed } = useLayout()
  const geoEnabled = useFeatureFlag('enableGeoView')

  return (
    <motion.aside
      className={cn(
        'h-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]',
        'flex flex-col overflow-hidden select-none',
      )}
      onMouseEnter={() => {
        if (collapsed) setSidebarCollapsed(false)
      }}
      onMouseLeave={() => {
        if (!collapsed) setSidebarCollapsed(true)
      }}
    >
      {/* Brand */}
      <div className="flex items-center h-16 px-4 shrink-0">
        <span
          className={cn(
            'font-mono font-bold text-[var(--color-accent)] tracking-wider',
            collapsed ? 'text-sm' : 'text-base',
          )}
        >
          {collapsed ? 'PM' : 'POLYMATIC'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-2">
        {navItems.map((item) => {
          if (item.featureFlag === 'enableGeoView' && !geoEnabled) return null
          return <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        })}

        <div className="flex-1" />

        <div className="border-t border-[var(--color-border)] my-2" />

        {bottomItems.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}

        <div className="px-1 py-2">
          <LayoutSwitcher collapsed={collapsed} />
        </div>
      </nav>
    </motion.aside>
  )
}

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
          'text-sm font-medium',
          isActive
            ? 'bg-[var(--color-bg-hover)] text-[var(--color-accent)]'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
          collapsed && 'justify-center px-2',
        )
      }
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}
