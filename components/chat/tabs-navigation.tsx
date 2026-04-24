"use client"

import { MessageCircle, Activity, BarChart3, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export type TabId = "chat" | "ritmos" | "progreso" | "agenda"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { id: "chat", label: "Chat", icon: <MessageCircle className="h-4 w-4" /> },
  { id: "ritmos", label: "Mis Ritmos", icon: <Activity className="h-4 w-4" /> },
  { id: "progreso", label: "Progreso", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "agenda", label: "Agenda", icon: <Calendar className="h-4 w-4" /> },
]

interface TabsNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <nav className="fixed top-[68px] left-0 right-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
