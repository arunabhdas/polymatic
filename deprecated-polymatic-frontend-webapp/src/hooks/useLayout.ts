import { useEffect } from 'react'
import { useUIStore } from '@/state/uiStore'

const COLLAPSE_BREAKPOINT = 1280

export function useLayout() {
  const layoutMode = useUIStore((s) => s.layoutMode)
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const viewportWidth = useUIStore((s) => s.viewportWidth)
  const setLayoutMode = useUIStore((s) => s.setLayoutMode)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const setViewportWidth = useUIStore((s) => s.setViewportWidth)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setViewportWidth(width)

      if (width < COLLAPSE_BREAKPOINT) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarCollapsed, setViewportWidth])

  const isNarrow = viewportWidth < COLLAPSE_BREAKPOINT
  const effectiveSidebarCollapsed =
    sidebarCollapsed || isNarrow || layoutMode === 'focus' || layoutMode === 'clean'
  const showRightPanel = layoutMode !== 'clean'
  const showSidebar = layoutMode !== 'clean'

  return {
    layoutMode,
    sidebarCollapsed: effectiveSidebarCollapsed,
    showRightPanel,
    showSidebar,
    isNarrow,
    viewportWidth,
    setLayoutMode,
    setSidebarCollapsed,
  }
}
