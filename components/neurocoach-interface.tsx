'use client'

import { useState, useRef, useEffect } from 'react'
import { Info, Mic, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FAQsAccordion } from '@/components/faqs-accordion'
import { HabitContractCard } from '@/components/habit-contract-card'
import { useToast } from '@/hooks/use-toast'
import type { Challenge } from './neurocoach-app'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  showContract?: boolean
}

const challengeMessages: Record<Challenge, string> = {
  burnout:
    'Vi que luchas con el burnout laboral. Empecemos reduciendo la fricción y creando un pequeño hábito para recuperar tu energía. ¿Qué pequeño hábito quieres lograr?',
  constancy:
    'Veo que necesitas ayuda para mantener la constancia. Vamos a construir ritmos que se adapten a tu vida. ¿Cuál es el hábito que quieres anclar?',
  stress:
    'Entiendo que el estrés y la ansiedad te afectan. Implementaremos técnicas basadas en neurociencia para calmarte. ¿Qué práctica te gustaría comenzar?',
}

const quickSuggestions = [
  'Empezar a meditar cada mañana',
  'Hacer ejercicio 3 veces por semana',
  'Leer 20 minutos antes de dormir',
]

export interface NeuroCoachInterfaceProps {
  challenge: Challenge
  onReset: () => void
}

export function NeuroCoachInterface({ challenge, onReset }: NeuroCoachInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: challengeMessages[challenge],
      showContract: true,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content:
          'Excelente. Puedo ayudarte con eso. Vamos a crear un compromiso formal para asegurar que lo cumplas.',
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const handleSendClick = () => {
    handleSendMessage(inputValue)
  }

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'No soportado',
        description: 'Tu navegador no soporta entrada de voz.',
        variant: 'destructive',
      })
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (transcript) {
        handleSendMessage(transcript)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      toast({
        title: 'Error',
        description: 'No se pudo procesar el audio.',
        variant: 'destructive',
      })
    }

    recognition.start()
  }

  const handleActivateWDK = () => {
    toast({
      title: 'Workflow durable iniciado',
      description: 'El agente te contactará mañana para seguimiento.',
    })
  }

  const isOnboarding = messages.length === 1 && messages[0].role === 'assistant'

  return (
    <div className="flex h-dvh w-full flex-col bg-stone-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
            NeuroCoach
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>¿Cómo funciona NeuroCoach?</DialogTitle>
                <DialogDescription>
                  Descubre más sobre nuestro enfoque basado en neurociencia
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <FAQsAccordion />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
          {isOnboarding && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
                NeuroCoach: Tu espacio seguro para construir hábitos
              </h2>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Basado en la ciencia conductual de James Clear y BJ Fogg
              </p>

              {/* Quick Suggestion Cards */}
              <div className="grid w-full gap-3 sm:grid-cols-1">
                {[
                  { label: 'Burnout Laboral', value: 'burnout' },
                  { label: 'Falta de Constancia', value: 'constancy' },
                  { label: 'Estrés y Ansiedad', value: 'stress' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSendMessage(option.label)}
                    className="rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-slate-700"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Elige una opción arriba o simplemente cuéntame, ¿qué desafío enfrentas hoy?
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id}>
              {/* Message Bubble */}
              <div
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-lg rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white dark:bg-emerald-700'
                      : 'bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>

              {/* Habit Contract Card */}
              {message.showContract && (
                <div className="mt-4 flex justify-start">
                  <HabitContractCard onActivate={handleActivateWDK} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Always Visible */}
      <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <Input
              placeholder="Escribe tu respuesta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendClick()
                }
              }}
              className="flex-1 border-slate-300 dark:border-slate-600"
            />
            <Button
              size="icon"
              variant={isListening ? 'destructive' : 'outline'}
              onClick={handleVoiceInput}
              className="h-10 w-10"
              title="Entrada por voz"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={handleSendClick}
              className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
