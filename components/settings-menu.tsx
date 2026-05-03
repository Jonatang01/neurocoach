"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Settings, Sun, Moon, Monitor, Languages, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n, Locale } from "@/lib/i18n"
import { HelpDialog } from "./help-dialog"

export function SettingsMenu() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useI18n()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20">
            <Settings className="h-4 w-4" />
            <span className="sr-only">{t("settings")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Theme */}
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t("theme")}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
            <Sun className="h-4 w-4" />
            {t("light")}
            {theme === "light" && <span className="ml-auto text-xs text-primary">●</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
            <Moon className="h-4 w-4" />
            {t("dark")}
            {theme === "dark" && <span className="ml-auto text-xs text-primary">●</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
            <Monitor className="h-4 w-4" />
            {t("system")}
            {theme === "system" && <span className="ml-auto text-xs text-primary">●</span>}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Language */}
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t("language")}
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setLocale("es")} className="gap-2">
            <Languages className="h-4 w-4" />
            {t("spanish")}
            {locale === "es" && <span className="ml-auto text-xs text-primary">●</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLocale("en")} className="gap-2">
            <Languages className="h-4 w-4" />
            {t("english")}
            {locale === "en" && <span className="ml-auto text-xs text-primary">●</span>}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Help */}
          <DropdownMenuItem onClick={() => setHelpOpen(true)} className="gap-2">
            <HelpCircle className="h-4 w-4" />
            {t("help")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  )
}
