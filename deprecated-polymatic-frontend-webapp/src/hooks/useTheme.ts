import { useUIStore } from '@/state/uiStore'

export function useTheme() {
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const setTheme = useUIStore((s) => s.setTheme)

  return { theme, toggleTheme, setTheme }
}
