import { Sidebar } from "@/sidebar/Sidebar"
import { TopBar } from "./TopBar"
import { RightPanel } from "@/panels/RightPanel"
import { Outlet } from "react-router-dom"

export function AppShell() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar - fixed width */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 bg-background">
        <TopBar />
        <main className="flex-1 overflow-auto relative rounded-tl-lg border-t border-l border-border/40 bg-card/30 shadow-sm mr-2 mt-2 mb-2 rounded-lg">
          <Outlet />
        </main>
      </div>

      {/* Right Panel - Contextual */}
      <RightPanel />
    </div>
  )
}
