"use client"

import { useEffect, useRef } from "react"
import type { UIMessage } from "@ai-sdk/react"
import { MessageBubble } from "./message-bubble"
import { CalendarCard } from "./calendar-card"
import { HabitContract } from "@/components/HabitContract"

interface ChatAreaProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              ¡Bienvenido a NeuroCoach!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Tu coach personal de hábitos está listo para ayudarte.
              <br />
              Cuéntame, ¿qué hábito te gustaría desarrollar?
            </p>

            {/* Quick action chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Quiero meditar cada mañana",
                "Agendame ejercicio mañana a las 7am",
                "Me comprometo a leer después de cenar",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow"
                  onClick={() => {
                    const event = new CustomEvent("neurocoach:suggest", {
                      detail: suggestion,
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  {suggestion}
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
                // Cast to any for flexible type checking in AI SDK 6
                const typedPart = part as any
                const partType = typedPart.type as string

                // Render text parts
                if (partType === "text" && typedPart.text?.trim()) {
                  return (
                    <MessageBubble
                      key={`${message.id}-text-${partIndex}`}
                      text={typedPart.text}
                      role={message.role}
                    />
                  )
                }

                // --- crearEvento (AI SDK 6 format: tool-{toolName}) ---
                if (partType === "tool-crearEvento") {
                  if (typedPart.state === "input-streaming" || typedPart.state === "input-available") {
                    return (
                      <div key={typedPart.toolCallId || partIndex} className="max-w-[85%]">
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
                  if (typedPart.state === "output-available") {
                    const data = typedPart.output
                    return (
                      <div key={typedPart.toolCallId || partIndex} className="max-w-[85%]">
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
                if (partType === "tool-solicitarContrato") {
                  if (typedPart.state === "input-streaming" || typedPart.state === "input-available") {
                    return (
                      <div key={typedPart.toolCallId || partIndex} className="w-full max-w-[90%]">
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
                  if (typedPart.state === "output-available") {
                    const data = typedPart.output
                    return (
                      <div key={typedPart.toolCallId || partIndex} className="w-full max-w-[90%]">
                        <HabitContract
                          habito={data.habito}
                          ancla={data.ancla}
                        />
                      </div>
                    )
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
