"use client"

import { useEffect, useRef } from "react"
import type { UIMessage } from "@ai-sdk/react"
import { MessageBubble } from "./message-bubble"
import { CalendarCard } from "./calendar-card"
import { HabitContract } from "@/components/HabitContract"
import { Zap, Activity, Wind } from "lucide-react"
import { useAppSettings } from "@/contexts/app-settings"

interface ChatAreaProps {
  messages: UIMessage[]
  isLoading: boolean
}

const CHIP_ICONS = [Zap, Activity, Wind]
const CHIP_COLORS = [
  "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50",
  "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-950/50",
  "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50",
]
const CHIP_ICON_COLORS = ["text-amber-500", "text-violet-500", "text-emerald-500"]

export function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const { t } = useAppSettings()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const dispatchSuggestion = (text: string) => {
    window.dispatchEvent(new CustomEvent("neurocoach:suggest", { detail: text }))
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="mx-auto flex max-w-lg flex-col gap-3">
        {messages.length === 0 ? (
          /* ───────── ONBOARDING STATE ───────── */
          <div className="flex flex-col items-center gap-6 py-8 text-center">
            {/* Brain icon + heading */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">
                <span className="text-4xl">🧠</span>
                <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {t.onboardingHeading}
                </h2>
                <p className="mt-0.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {t.onboardingSubheading}
                </p>
              </div>
              <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.onboardingByline}{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">James Clear</span>{" "}
                {t.onboardingAnd}{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">BJ Fogg</span>
              </p>
            </div>

            {/* Impact chips */}
            <div className="w-full">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t.onboardingChallenge}
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
                {t.chips.map((chip, i) => {
                  const Icon = CHIP_ICONS[i]
                  return (
                    <button
                      key={chip.id}
                      onClick={() => dispatchSuggestion(chip.description)}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all hover:shadow-md active:scale-[0.98] sm:w-auto w-full ${CHIP_COLORS[i]}`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/70 dark:bg-white/10 shadow-sm ${CHIP_ICON_COLORS[i]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{chip.label}</p>
                        <p className="text-xs opacity-75 truncate">{chip.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Separator + invite text */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-medium text-slate-400">{t.onboardingOr}</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
                {t.onboardingInvite}{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {t.onboardingInviteBold}
                </span>
              </p>
            </div>
          </div>
        ) : (
          /* ───────── MESSAGE HISTORY ───────── */
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full flex-col gap-2 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {message.parts.map((part, partIndex) => {
                if (part.type === "text" && part.text?.trim()) {
                  return (
                    <MessageBubble
                      key={`${message.id}-text-${partIndex}`}
                      text={part.text}
                      role={message.role}
                    />
                  )
                }

                if (
                  part.type === "tool-invocation" ||
                  (part.type as string).startsWith("tool-")
                ) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const inv = part as any
                  const toolName: string = inv.toolName ?? inv.toolInvocation?.toolName
                  const toolCallId: string = inv.toolCallId ?? inv.toolInvocation?.toolCallId
                  const state: string = inv.state ?? inv.toolInvocation?.state
                  const result = inv.output ?? inv.result ?? inv.toolInvocation?.result

                  if (toolName === "crearEvento") {
                    if (state === "call" || state === "partial-call" || state === "input-streaming") {
                      return (
                        <div key={toolCallId} className="max-w-[85%]">
                          <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                            <div className="h-10 bg-gradient-to-r from-blue-400 to-blue-500" />
                            <div className="p-4 space-y-3">
                              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
                              <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />
                              <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    if (state === "result" || state === "output") {
                      return (
                        <div key={toolCallId} className="max-w-[85%]">
                          <CalendarCard
                            title={result?.titulo}
                            date={result?.fecha}
                            time={result?.hora}
                            location={result?.ubicacion}
                          />
                        </div>
                      )
                    }
                  }

                  if (toolName === "solicitarContrato") {
                    if (state === "call" || state === "partial-call" || state === "input-streaming") {
                      return (
                        <div key={toolCallId} className="w-full max-w-[90%]">
                          <div className="animate-pulse overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 shadow-lg">
                            <div className="h-16 bg-gradient-to-br from-indigo-500 to-purple-600" />
                            <div className="p-5 space-y-4">
                              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-4 space-y-2">
                                <div className="mx-auto h-3 w-1/3 rounded bg-indigo-200 dark:bg-indigo-800" />
                                <div className="mx-auto h-4 w-3/4 rounded bg-indigo-200 dark:bg-indigo-800" />
                                <div className="mx-auto h-4 w-2/3 rounded bg-indigo-200 dark:bg-indigo-800" />
                              </div>
                              <div className="h-10 w-full rounded-xl bg-indigo-200 dark:bg-indigo-800" />
                            </div>
                          </div>
                        </div>
                      )
                    }
                    if (state === "result" || state === "output") {
                      return (
                        <div key={toolCallId} className="w-full max-w-[90%]">
                          <HabitContract habito={result?.habito} ancla={result?.ancla} />
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

        {/* MCP Loading indicator */}
        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "user" && (
            <div className="flex w-full flex-col gap-2 items-start">
              <div className="flex items-center gap-2 rounded-2xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                </div>
                <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                  {t.mcpLoading}
                </span>
              </div>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
