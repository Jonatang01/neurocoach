"use client"

import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  text: string
  role: "user" | "assistant" | "system" | "data"
}

export function MessageBubble({ text, role }: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm",
        isUser
          ? "rounded-br-sm bg-indigo-600 text-white"
          : "rounded-bl-sm bg-gray-200 text-gray-900"
      )}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  )
}
