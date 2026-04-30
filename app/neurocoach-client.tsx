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

  // Track processed tool calls to avoid duplicates
  const [processedToolCalls, setProcessedToolCalls] = useState<Set<string>>(new Set())

  // Listen for tool results in messages to update global state
  // AI SDK 6 uses tool-{toolName} pattern for parts (e.g., tool-crearEvento)
  useEffect(() => {
    if (!messages.length) return

    // Scan all messages for tool parts
    for (const message of messages) {
      if (message.role !== "assistant" || !message.parts) continue

      for (const part of message.parts as any[]) {
        // AI SDK 6 tool parts use "tool-{toolName}" type pattern
        const partType = part.type as string
        
        // Log all parts for debugging
        if (partType.startsWith("tool-")) {
          console.log("[v0] Tool part found:", { type: partType, state: part.state, part })
        }

        // Handle crearEvento tool
        if (partType === "tool-crearEvento" && part.state === "output-available") {
          const toolCallId = part.toolCallId
          if (!toolCallId || processedToolCalls.has(toolCallId)) continue

          const output = part.output
          console.log("[v0] crearEvento output:", output)

          if (output?.success) {
            addEvent({
              title: output.titulo,
              dateTime: output.fechaHoraInicio,
              durationMinutes: output.duracionMinutos || 60,
              icon: "Calendar",
              color: "bg-indigo-500",
              source: "chat",
            })
            setProcessedToolCalls(prev => new Set(prev).add(toolCallId))
          }
        }

        // Handle solicitarContrato tool
        if (partType === "tool-solicitarContrato" && part.state === "output-available") {
          const toolCallId = part.toolCallId
          if (!toolCallId || processedToolCalls.has(toolCallId)) continue

          const output = part.output
          console.log("[v0] solicitarContrato output:", output)

          if (output?.habito) {
            addHabit({
              name: output.habito,
              icon: "Flame",
              color: "bg-purple-500",
              ancla: output.ancla,
            })
            setProcessedToolCalls(prev => new Set(prev).add(toolCallId))
          }
        }
      }
    }
  }, [messages, addEvent, addHabit, processedToolCalls])

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
