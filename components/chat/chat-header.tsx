"use client"

import { Brain, Sparkles, Sun, Moon, Languages, Info, X, ChevronDown } from "lucide-react"
import { useAppSettings } from "@/contexts/app-settings"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ChatHeaderProps {
  level?: number
  points?: number
}

function FaqModal() {
  const { t } = useAppSettings()
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t.faqTitle}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-white/25 active:scale-95"
      >
        <Info className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div
            className={cn(
              "relative z-10 w-full max-w-lg mx-auto",
              "bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl",
              "max-h-[85dvh] flex flex-col",
              "animate-in slide-in-from-bottom-4 duration-300"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{t.faqTitle}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.faqSubtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Accordion */}
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-2">
              {t.faq.map((item) => {
                const isOpen = expandedId === item.id
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-2xl border transition-all duration-200",
                      isOpen
                        ? "border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40"
                        : "border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                    )}
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="text-xl leading-none">{item.emoji}</span>
                      <span className={cn(
                        "flex-1 text-sm font-semibold transition-colors",
                        isOpen ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"
                      )}>
                        {item.question}
                      </span>
                      <ChevronDown className={cn(
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-indigo-500"
                      )} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 pl-9">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center pb-3 pt-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function ChatHeader({ level = 4, points = 1250 }: ChatHeaderProps) {
  const { t, theme, toggleTheme, toggleLang } = useAppSettings()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 dark:bg-indigo-900 px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-white leading-tight">{t.appName}</h1>
            <p className="text-xs text-indigo-200 truncate">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Points badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
            <span className="text-xs font-medium text-white">{t.level} {level}</span>
            <span className="text-indigo-300">|</span>
            <span suppressHydrationWarning className="text-xs font-semibold text-white">
              {points.toLocaleString()} {t.points}
            </span>
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label={t.toggleLang}
            title={t.toggleLang}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-white/25 active:scale-95"
          >
            <Languages className="h-4.5 w-4.5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.toggleLight : t.toggleDark}
            title={theme === "dark" ? t.toggleLight : t.toggleDark}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-white/25 active:scale-95"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* FAQ */}
          <FaqModal />
        </div>
      </div>
    </header>
  )
}
