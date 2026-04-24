"use client"

import { Brain, Sparkles } from "lucide-react"

interface ChatHeaderProps {
  level?: number
  points?: number
}

export function ChatHeader({ level = 4, points = 1250 }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">NeuroCoach</h1>
            <p className="text-xs text-indigo-200">Tu coach de hábitos inteligente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
          <span className="text-xs font-medium text-white">Nivel {level}</span>
          <span className="text-indigo-300">|</span>
          <span className="text-xs font-semibold text-white">{points.toLocaleString()} pts</span>
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
        </div>
      </div>
    </header>
  )
}
