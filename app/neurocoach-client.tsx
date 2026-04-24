"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { ChatHeader } from "@/components/chat/chat-header"
import { TabsNavigation, type TabId } from "@/components/chat/tabs-navigation"
import { ChatArea } from "@/components/chat/chat-area"
import { ChatInput } from "@/components/chat/chat-input"
import { RitmosTab } from "@/components/tabs/ritmos-tab"
import { ProgresoTab } from "@/components/tabs/progreso-tab"
import { AgendaTab } from "@/components/tabs/agenda-tab"

export default function NeuroCoachClient() {
  const [activeTab, setActiveTab] = useState<TabId>("chat")
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error } = useChat()

  const isLoading = status === "submitted" || status === "streaming"

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return
    sendMessage({ text })
    setInput("")
  }

  return (
    <div className="flex h-dvh flex-col bg-slate-50">
      <ChatHeader level={4} points={1250} />
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
