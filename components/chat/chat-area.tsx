"use client"

import { useEffect, useRef, useState } from "react"
import type { UIMessage } from "@ai-sdk/react"
import { MessageBubble } from "./message-bubble"
import { CalendarCard } from "./calendar-card"
import { HabitContract } from "@/components/HabitContract"

const translations = {
  ES: {
    title: 'NeuroCoach: Tu espacio seguro para construir habitos',
    subtitle: 'Basado en la ciencia conductual de James Clear y BJ Fogg.',
    helper: 'Elige una sugerencia o cuentame tu desafio de hoy.',
    burnout: 'Burnout Laboral',
    burnoutDesc: 'Recupera tu energia',
    constancy: 'Falta de Constancia',
    constancyDesc: 'Crea ritmos sostenibles',
    stress: 'Estres y Ansiedad',
    stressDesc: 'Tecnicas basadas en neurociencia',
  },
  EN: {
    title: 'NeuroCoach: Your safe space to build habits',
    subtitle: 'Based on behavioral science by James Clear and BJ Fogg.',
    helper: 'Choose a suggestion or tell me your challenge today.',
    burnout: 'Work Burnout',
    burnoutDesc: 'Recover your energy',
    constancy: 'Lack of Consistency',
    constancyDesc: 'Create sustainable rhythms',
    stress: 'Stress and Anxiety',
    stressDesc: 'Science-based techniques',
  },
}

interface ChatAreaProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [lang, setLang] = useState<'ES' | 'EN'>('ES')
  
  useEffect(() => {
    const saved = localStorage.getItem('neurocoach-lang') as 'ES' | 'EN'
    if (saved) setLang(saved)
    
    const handleLangChange = (e: CustomEvent) => setLang(e.detail)
    window.addEventListener('language-change', handleLangChange as EventListener)
    return () => window.removeEventListener('language-change', handleLangChange as EventListener)
  }, [])
  
  const t = translations[lang]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto flex max-w-lg flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t.subtitle}
              <br />
              {t.helper}
            </p>

            {/* Quick Suggestion Cards */}
            <div className="mt-8 w-full space-y-2">
              {[
                { emoji: "💼", label: t.burnout, desc: t.burnoutDesc },
                { emoji: "⚡", label: t.constancy, desc: t.constancyDesc },
                { emoji: "😰", label: t.stress, desc: t.stressDesc },
              ].map((card) => (
                <button
                  key={card.label}
                  onClick={() => {
                    const event = new CustomEvent("neurocoach:suggest", {
                      detail: card.label,
                    })
                    window.dispatchEvent(event)
                  }}
                  className="w-full rounded-lg border-2 border-indigo-200 bg-white p-3 text-left transition-all hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-900 dark:bg-slate-800 dark:hover:border-indigo-600 dark:hover:bg-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{card.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{card.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{card.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full flex-col gap-2 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {message.parts.map((part, partIndex) => {
                // Render text parts
                if (part.type === "text" && part.text?.trim()) {
                  return (
                    <MessageBubble
                      key={`${message.id}-text-${partIndex}`}
                      text={part.text}
                      role={message.role}
                    />
                  )
                }

                // Render tool invocations (Generative UI)
                if (part.type === "tool-invocation") {
                  const { toolInvocation } = part

                  // --- crearEvento ---
                  if (toolInvocation.toolName === "crearEvento") {
                    if (toolInvocation.state === "call" || toolInvocation.state === "partial-call") {
                      return (
                        <div key={toolInvocation.toolCallId} className="max-w-[85%]">
                          <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="h-10 bg-gradient-to-r from-blue-400 to-blue-500" />
                            <div className="p-4 space-y-3">
                              <div className="h-4 w-3/4 rounded bg-gray-200" />
                              <div className="h-3 w-1/2 rounded bg-gray-200" />
                              <div className="h-3 w-2/3 rounded bg-gray-200" />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    if (toolInvocation.state === "result") {
                      const data = toolInvocation.result
                      return (
                        <div key={toolInvocation.toolCallId} className="max-w-[85%]">
                          <CalendarCard
                            titulo={data.titulo}
                            fechaHoraInicio={data.fechaHoraInicio}
                            duracionMinutos={data.duracionMinutos}
                            link={data.link}
                            success={data.success}
                            error={data.error}
                            demo={data.demo}
                          />
                        </div>
                      )
                    }
                  }

                  // --- solicitarContrato ---
                  if (toolInvocation.toolName === "solicitarContrato") {
                    if (toolInvocation.state === "call" || toolInvocation.state === "partial-call") {
                      return (
                        <div key={toolInvocation.toolCallId} className="w-full max-w-[90%]">
                          <div className="animate-pulse overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-lg">
                            <div className="h-16 bg-gradient-to-br from-indigo-500 to-purple-600" />
                            <div className="p-5 space-y-4">
                              <div className="rounded-xl bg-indigo-50 p-4 space-y-2">
                                <div className="mx-auto h-3 w-1/3 rounded bg-indigo-200" />
                                <div className="mx-auto h-4 w-3/4 rounded bg-indigo-200" />
                                <div className="mx-auto h-4 w-2/3 rounded bg-indigo-200" />
                              </div>
                              <div className="h-10 w-full rounded-xl bg-indigo-200" />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    if (toolInvocation.state === "result") {
                      const data = toolInvocation.result
                      return (
                        <div key={toolInvocation.toolCallId} className="w-full max-w-[90%]">
                          <HabitContract
                            habito={data.habito}
                            ancla={data.ancla}
                          />
                        </div>
                      )
                    }
                  }
                }

                return null
              })}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "user" && (
            <div className="flex w-full flex-col gap-2 items-start">
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-4 py-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
              </div>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
