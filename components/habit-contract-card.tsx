'use client'

import { CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface HabitContractCardProps {
  onActivate: () => void
}

export function HabitContractCard({ onActivate }: HabitContractCardProps) {
  return (
    <div className="w-full max-w-lg rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-900 dark:from-emerald-950 dark:to-teal-950">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Contrato de Identidad
        </h3>
      </div>

      {/* Contract Content */}
      <div className="space-y-4 rounded-lg bg-white/50 p-4 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Después de mi café matutino,
          </p>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Haré 10 minutos de meditación
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Este compromiso se basa en la ciencia conductual de Tiny Habits (BJ Fogg). Al anclar tu nuevo hábito a una rutina existente, aumentas las probabilidades de éxito en un 300%.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onActivate}
        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
      >
        <Zap className="mr-2 h-4 w-4" />
        Activar Seguimiento WDK (24hs)
      </Button>

      <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-500">
        Vercel Workflow Agents te contactará mañana
      </p>
    </div>
  )
}
