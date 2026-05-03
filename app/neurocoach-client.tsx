"use client"

import { useState, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { ChatHeader } from "@/components/chat/chat-header"
import { TabsNavigation, type TabId } from "@/components/chat/tabs-navigation"
import { ChatArea } from "@/components/chat/chat-area"
import { ChatInput } from "@/components/chat/chat-input"
import { RitmosTab } from "@/components/tabs/ritmos-tab"
import { ProgresoTab } from "@/components/tabs/progreso-tab"
import { AgendaTab } from "@/components/tabs/agenda-tab"
import { NeuroCoachProvider, useNeuroCoach } from "@/lib/neurocoach-context"

function NeuroCoachContent() {
  const [activeTab, setActiveTab] = useState<TabId>("chat")
  const [input, setInput] = useState("")
  const { progress, addHabit, addEvent } = useNeuroCoach()

  const { messages, sendMessage, status, error } = useChat()

  const isLoading = status === "submitted" || status === "streaming"

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return
    sendMessage({ text })
    setInput("")
  }

  // Listen for tool results in messages to update global state
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "assistant") return

    // Check for tool invocations in parts
    if (lastMessage.parts) {
      for (const part of lastMessage.parts) {
        if (part.type === "tool-invocation" && part.state === "output-available") {
          const toolName = part.toolInvocation?.toolName
          const result = part.toolInvocation?.result

          if (toolName === "crearEvento" && result?.success) {
            // Add event to global state
            addEvent({
              title: result.titulo,
              dateTime: result.fechaHoraInicio,
              durationMinutes: result.duracionMinutos || 60,
              icon: "Calendar",
              color: "bg-indigo-500",
              source: "chat",
            })
          }

          if (toolName === "solicitarContrato" && result?.habito) {
            // Add habit from contract to global state
            addHabit({
              name: result.habito,
              icon: "Flame",
              color: "bg-purple-500",
              ancla: result.ancla,
            })
          }
        }
      }
    }
  }, [messages, addEvent, addHabit])

  return (
    <div className="flex h-dvh flex-col bg-slate-50">
      <ChatHeader level={progress.level} points={progress.points} />
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Spacer for fixed header + tabs */}
      <div className="h-[120px]" />

      {/* Tab Content */}
      {activeTab === "chat" && (
        <>
          <ChatArea messages={messages} isLoading={isLoading} />

          {/* Error display */}
          {error && (
            <div className="px-4 pb-2">
              <div className="mx-auto max-w-lg">
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <p className="font-medium">Error de conexión</p>
                  <p className="mt-1 text-xs text-red-600">
                    {error.message || "No se pudo conectar con el coach. Verificá tu conexión."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Spacer for fixed input */}
          <div className="h-16" />

          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </>
      )}

      {activeTab === "ritmos" && <RitmosTab />}
      {activeTab === "progreso" && <ProgresoTab />}
      {activeTab === "agenda" && <AgendaTab />}
    </div>
  )
}

export default function NeuroCoachClient() {
  return (
    <NeuroCoachProvider>
      <NeuroCoachContent />
    </NeuroCoachProvider>
  )
}
