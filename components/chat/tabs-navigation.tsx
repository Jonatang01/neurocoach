"use client"

import { MessageCircle, Activity, BarChart3, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

export type TabId = "chat" | "ritmos" | "progreso" | "agenda"

interface TabsNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const { t } = useI18n()

  const tabs = [
    { id: "chat" as TabId, labelKey: "chat" as const, icon: <MessageCircle className="h-4 w-4" /> },
    { id: "ritmos" as TabId, labelKey: "rhythms" as const, icon: <Activity className="h-4 w-4" /> },
    { id: "progreso" as TabId, labelKey: "progress" as const, icon: <BarChart3 className="h-4 w-4" /> },
    { id: "agenda" as TabId, labelKey: "agenda" as const, icon: <Calendar className="h-4 w-4" /> },
  ]

  return (
    <nav className="fixed top-[68px] left-0 right-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            <span>{t(tab.labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
