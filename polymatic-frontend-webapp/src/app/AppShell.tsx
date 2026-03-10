import { Sidebar } from "@/sidebar/Sidebar"
import { TopBar } from "./TopBar"
import { RightPanel } from "@/panels/RightPanel"
import { Outlet } from "react-router-dom"

export function AppShell() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 border-l border-border bg-background">
        <TopBar />
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
      <RightPanel />
    </div>
  )
}
