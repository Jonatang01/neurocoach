"use client"

import { useState } from "react"
import {
  FileSignature,
  Sparkles,
  Check,
  Shield,
  Anchor,
  Target,
  Workflow,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSettings } from "@/contexts/app-settings"

interface HabitContractProps {
  habito: string
  ancla: string
}

function WdkToast({ visible, title, body }: { visible: boolean; title: string; body: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 transform",
        "flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl",
        "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
        "transition-all duration-500 ease-out pointer-events-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Bell className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight">{title}</p>
        <p className="text-xs text-violet-200 mt-0.5">{body}</p>
      </div>
    </div>
  )
}

export function HabitContract({ habito, ancla }: HabitContractProps) {
  const { t } = useAppSettings()
  const [signed, setSigned] = useState(false)
  const [signing, setSigning] = useState(false)
  const [wdkActivating, setWdkActivating] = useState(false)
  const [wdkActive, setWdkActive] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSign = async () => {
    setSigning(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    try {
      await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: "NeuroCoach User", habito, ancla }),
      })
    } catch {
      console.warn("Workflow trigger failed (expected in dev without Vercel)")
    }
    setSigning(false)
    setSigned(true)
  }

  const handleActivateWdk = async () => {
    if (wdkActive || wdkActivating) return
    setWdkActivating(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    try {
      await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: "NeuroCoach User", habito, ancla, tipo: "wdk-followup-24h" }),
      })
    } catch {
      console.warn("WDK workflow trigger failed (expected in dev without Vercel)")
    }
    setWdkActivating(false)
    setWdkActive(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  return (
    <>
      <WdkToast visible={showToast} title={t.toastTitle} body={t.toastBody} />

      <div className="w-full overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-lg">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 py-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <FileSignature className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                {t.contractTitle}
              </h3>
              <p className="text-xs text-indigo-200">{t.contractSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {/* Commitment */}
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 p-4 border border-indigo-100 dark:border-indigo-800">
            <p className="text-center text-sm leading-relaxed text-gray-700 dark:text-slate-200">
              <span className="text-xs uppercase tracking-wider text-indigo-400 dark:text-indigo-400 font-semibold block mb-2">
                {t.contractCommit}
              </span>
              <span className="block text-base">
                {t.contractAfter}{" "}
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                  <Anchor className="h-3 w-3" />
                  {ancla}
                </span>
              </span>
              <span className="block mt-1.5 text-base">
                {t.contractWillDo}{" "}
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                  <Target className="h-3 w-3" />
                  {habito}
                </span>
              </span>
            </p>
          </div>

          {/* Science badges */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-slate-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>{t.contractTinyHabits}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>{t.contractPoints}</span>
            </div>
          </div>

          {/* Sign button */}
          {!signed ? (
            <button
              onClick={handleSign}
              disabled={signing}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
                signing
                  ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-400 cursor-wait"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
              )}
            >
              {signing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
                  {t.contractSigning}
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4" />
                  {t.contractSign}
                </>
              )}
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              {/* Signed state */}
              <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-3 w-3 text-white" />
                </div>
                {t.contractSigned}
              </div>

              {/* WDK button */}
              {!wdkActive ? (
                <button
                  onClick={handleActivateWdk}
                  disabled={wdkActivating}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all border",
                    wdkActivating
                      ? "bg-violet-50 dark:bg-violet-950/30 text-violet-300 border-violet-100 dark:border-violet-900 cursor-wait"
                      : "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-950/50 hover:shadow-md active:scale-[0.98]"
                  )}
                >
                  {wdkActivating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-500" />
                      {t.contractWdkActivating}
                    </>
                  ) : (
                    <>
                      <Workflow className="h-4 w-4" />
                      {t.contractWdk}
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 py-3 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {t.contractWdkActive}
                </div>
              )}

              <p className="text-center text-xs text-gray-400 dark:text-slate-500">
                {t.contractReminder}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
