"use client"

import { useState } from "react"
import { Brain, Sparkles, Globe, Sun, Moon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/lib/language-context"

interface ChatHeaderProps {
  level?: number
  points?: number
}

function formatPoints(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

const faqs = {
  ES: [
    {
      value: 'what-is',
      question: '¿Qué es NeuroCoach?',
      answer: 'Un agente basado en ciencia conductual (James Clear, BJ Fogg) para ayudarte a construir hábitos saludables.'
    },
    {
      value: 'mcp',
      question: '¿Cómo usa la IA? (Track MCP)',
      answer: 'Utilizamos el Model Context Protocol (MCP) para conectar al agente con literatura clínica real.'
    },
    {
      value: 'wdk',
      question: '¿Qué pasa si me olvido de entrar? (Track WDK)',
      answer: 'Usamos Vercel Workflow Agents. El agente despierta a las 24 horas para preguntarte cómo te fue.'
    },
    {
      value: 'impact',
      question: '¿Cuál es el impacto social?',
      answer: 'Democratizamos el acceso a la salud mental preventiva, ayudando a reducir el burnout.'
    }
  ],
  EN: [
    {
      value: 'what-is',
      question: 'What is NeuroCoach?',
      answer: 'An agent based on behavioral science (James Clear, BJ Fogg) to help you build healthy habits.'
    },
    {
      value: 'mcp',
      question: 'How does AI work? (Track MCP)',
      answer: 'We use the Model Context Protocol (MCP) to connect the agent with real clinical literature.'
    },
    {
      value: 'wdk',
      question: 'What if I forget to check in? (Track WDK)',
      answer: 'We use Vercel Workflow Agents. The agent wakes up at 24 hours to ask you how you did.'
    },
    {
      value: 'impact',
      question: 'What is the social impact?',
      answer: 'We democratize access to preventive mental health, helping to reduce burnout.'
    }
  ]
}

function InlineFAQs({ lang }: { lang: 'ES' | 'EN' }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {faqs[lang].map((faq) => (
        <AccordionItem key={faq.value} value={faq.value} className="border-b border-gray-200 dark:border-slate-700">
          <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-slate-300">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function ChatHeader({ level = 4, points = 1250 }: ChatHeaderProps) {
  const { language, setLanguage } = useLanguage()
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

  const translations = {
    ES: {
      subtitle: "Tu coach de hábitos inteligente",
      faqTitle: "¿Cómo funciona NeuroCoach?",
      faqDesc: "Descubre más sobre nuestro enfoque basado en neurociencia",
      changeLanguage: "Cambiar idioma a English",
      changeTheme: "Cambiar tema"
    },
    EN: {
      subtitle: "Your intelligent habits coach",
      faqTitle: "How does NeuroCoach work?",
      faqDesc: "Discover more about our science-based approach",
      changeLanguage: "Change language to Español",
      changeTheme: "Change theme"
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
            <p className="text-xs text-indigo-200 dark:text-slate-400">{translations[language].subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 w-auto px-2 text-white hover:bg-white/20"
            title={translations[language].changeLanguage}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs font-semibold">{language}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 text-white hover:bg-white/20"
            title={translations[language].changeTheme}
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
                <DialogTitle>{translations[language].faqTitle}</DialogTitle>
                <DialogDescription>
                  {translations[language].faqDesc}
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <InlineFAQs lang={language} />
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
