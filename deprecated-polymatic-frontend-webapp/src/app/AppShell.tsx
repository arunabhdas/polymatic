import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLayout } from '@/hooks/useLayout'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { RightPanel } from './RightPanel'
import { NotificationCenter } from './NotificationCenter'

export function AppShell() {
  const { sidebarCollapsed, showRightPanel, showSidebar } = useLayout()

  const sidebarWidth = !showSidebar
    ? '0px'
    : sidebarCollapsed
      ? 'var(--sidebar-collapsed-width)'
      : 'var(--sidebar-width)'

  const rightPanelWidth = showRightPanel ? 'var(--right-panel-width)' : '0px'

  return (
    <div className="relative h-screen overflow-hidden bg-[var(--color-bg-primary)]">
      <TopBar />
      <motion.div
        className="grid h-[calc(100vh-var(--topbar-height))] mt-[var(--topbar-height)]"
        animate={{
          gridTemplateColumns: `${sidebarWidth} 1fr ${rightPanelWidth}`,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {showSidebar && <Sidebar collapsed={sidebarCollapsed} />}

        <main className="overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        {showRightPanel && <RightPanel />}
      </motion.div>

      <NotificationCenter />
    </div>
  )
}
