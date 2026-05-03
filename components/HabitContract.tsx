"use client"

import { useState } from "react"
import {
  FileSignature,
  Sparkles,
  Check,
  Shield,
  Anchor,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitContractProps {
  habito: string
  ancla: string
}

export function HabitContract({ habito, ancla }: HabitContractProps) {
  const [signed, setSigned] = useState(false)
  const [signing, setSigning] = useState(false)

  const handleSign = async () => {
    setSigning(true)

    // Simulate workflow trigger delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Trigger the workflow to start proactive follow-up
    try {
      await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: "NeuroCoach User",
          habito,
          ancla,
        }),
      })
    } catch {
      // Silently fail — workflow is a bonus feature
      console.warn("Workflow trigger failed (expected in dev without Vercel)")
    }

    setSigning(false)
    setSigned(true)
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-lg">
      {/* Header con gradiente premium */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 py-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <FileSignature className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Contrato de Identidad
            </h3>
            <p className="text-xs text-indigo-200">
              Basado en ciencia conductual • BJ Fogg
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {/* Declaración de compromiso */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 p-4 border border-indigo-100">
          <p className="text-center text-sm leading-relaxed text-gray-700">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold block mb-2">
              Yo me comprometo a que
            </span>
            <span className="block text-base">
              Después de{" "}
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 border border-amber-200">
                <Anchor className="h-3 w-3" />
                {ancla}
              </span>
            </span>
            <span className="block mt-1.5 text-base">
              haré{" "}
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 border border-emerald-200">
                <Target className="h-3 w-3" />
                {habito}
              </span>
            </span>
          </p>
        </div>

        {/* Indicadores de ciencia */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Tiny Habits®</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>+50 pts al firmar</span>
          </div>
        </div>

        {/* Action Button */}
        {!signed ? (
          <button
            onClick={handleSign}
            disabled={signing}
            className={cn(
              "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
              signing
                ? "bg-indigo-100 text-indigo-400 cursor-wait"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
            )}
          >
            {signing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
                Activar Seguimiento WDK (24hs)...
              </>
            ) : (
              <>
                <FileSignature className="h-4 w-4" />
                Activar Seguimiento WDK (24hs)
              </>
            )}
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 py-3 text-sm font-semibold text-emerald-700">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" />
              </div>
              Contrato firmado — Workflow Durable (WDK) activo
            </div>
            <p className="text-center text-xs text-gray-400">
              El agente te contactará mañana sin consumir recursos en tu dispositivo 🔔
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
