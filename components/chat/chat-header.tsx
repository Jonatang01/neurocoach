"use client"

import { useState } from "react"
import { Brain, Sparkles, Globe, Sun, Moon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ChatHeaderProps {
  level?: number
  points?: number
}

function formatPoints(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

function InlineFAQs() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem value="what-is" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Que es NeuroCoach?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Un agente basado en ciencia conductual (James Clear, BJ Fogg) para ayudarte a construir habitos saludables.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mcp" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Como usa la IA? (Track MCP)
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Utilizamos el Model Context Protocol (MCP) para conectar al agente con literatura clinica real.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wdk" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Que pasa si me olvido de entrar? (Track WDK)
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Usamos Vercel Workflow Agents. El agente despierta a las 24 horas para preguntarte como te fue.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="impact" className="border-b border-gray-200 dark:border-slate-700">
        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
          Cual es el impacto social?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-slate-300">
          Democratizamos el acceso a la salud mental preventiva, ayudando a reducir el burnout.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function ChatHeader({ level = 4, points = 1250 }: ChatHeaderProps) {
  const [language, setLanguage] = useState<"ES" | "EN">("ES")
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const toggleLanguage = () => {
    setLanguage(language === "ES" ? "EN" : "ES")
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 px-4 py-3 shadow-md dark:bg-slate-900">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">NeuroCoach</h1>
            <p className="text-xs text-indigo-200 dark:text-slate-400">Tu coach de habitos inteligente</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 w-9 p-0 text-white hover:bg-white/20"
            title={`Cambiar idioma a ${language === "ES" ? "English" : "Espanol"}`}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs font-semibold">{language}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 text-white hover:bg-white/20"
            title="Cambiar tema"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-white hover:bg-white/20"
                title="Ver FAQs"
              >
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Como funciona NeuroCoach?</DialogTitle>
                <DialogDescription>
                  Descubre mas sobre nuestro enfoque basado en neurociencia
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <InlineFAQs />
              </div>
            </DialogContent>
          </Dialog>

          <div className="ml-2 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
            <span className="text-xs font-medium text-white">Nivel {level}</span>
            <span className="text-indigo-300">|</span>
            <span className="text-xs font-semibold text-white">{formatPoints(points)} pts</span>
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          </div>
        </div>
      </div>
    </header>
  )
}
