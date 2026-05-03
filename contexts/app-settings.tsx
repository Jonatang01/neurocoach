"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { translations, type Lang } from "@/lib/i18n"

type Theme = "light" | "dark"

interface AppSettingsContextValue {
  theme: Theme
  lang: Lang
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (typeof translations)[Lang]
  toggleTheme: () => void
  toggleLang: () => void
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [lang, setLang] = useState<Lang>("es")

  // Restore from localStorage on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("nc-theme") as Theme) ?? "light"
    const savedLang = (localStorage.getItem("nc-lang") as Lang) ?? "es"
    setTheme(savedTheme)
    setLang(savedLang)
    applyTheme(savedTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      localStorage.setItem("nc-theme", next)
      applyTheme(next)
      return next
    })
  }, [])

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "es" ? "en" : "es"
      localStorage.setItem("nc-lang", next)
      return next
    })
  }, [])

  const t = translations[lang]

  return (
    <AppSettingsContext.Provider value={{ theme, lang, t, toggleTheme, toggleLang }}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext)
  if (!ctx) throw new Error("useAppSettings must be used inside AppSettingsProvider")
  return ctx
}
