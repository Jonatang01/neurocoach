"use client"

import { Brain, Sparkles } from "lucide-react"
import { SettingsMenu } from "@/components/settings-menu"
import { useI18n } from "@/lib/i18n"

interface ChatHeaderProps {
  level?: number
  points?: number
}

// Formatear numero de forma consistente para evitar hydration mismatch
function formatPoints(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

export function ChatHeader({ level = 1, points = 0 }: ChatHeaderProps) {
  const { t } = useI18n()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 dark:bg-indigo-900 px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{t("appName")}</h1>
            <p className="text-xs text-indigo-200">{t("appTagline")}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
            <span className="text-xs font-medium text-white">{t("level")} {level}</span>
            <span className="text-indigo-300">|</span>
            <span className="text-xs font-semibold text-white">{formatPoints(points)} {t("points")}</span>
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          </div>
          <SettingsMenu />
        </div>
      </div>
    </header>
  )
}
