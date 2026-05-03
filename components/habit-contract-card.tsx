"use client"

import { useState } from "react"
import { CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface HabitContractCardProps {
  habito?: string
  ancla?: string
  onActivate?: () => void
}

export function HabitContractCard({ 
  habito = "Hacer ejercicio",
  ancla = "después del desayuno",
  onActivate 
}: HabitContractCardProps) {
  const [isActivated, setIsActivated] = useState(false)
  const { toast } = useToast()

  const handleActivateWDK = () => {
    setIsActivated(true)
    onActivate?.()
    
    toast({
      title: "¡Workflow durable iniciado!",
      description: "El agente te contactará mañana para preguntarte cómo te fue.",
      duration: 3000,
    })
  }

  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg dark:border-indigo-900 dark:from-slate-800 dark:to-slate-700">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Contrato de Hábito
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tu compromiso con el cambio
          </p>
        </div>
      </div>

      {/* Contract Text */}
      <div className="mb-6 space-y-3 rounded-xl bg-white px-4 py-4 dark:bg-slate-900/50">
        <p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
          Después de <span className="text-indigo-600 dark:text-indigo-400">{ancla}</span>
        </p>
        <div className="border-t-2 border-dashed border-indigo-200 dark:border-indigo-900" />
        <p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
          Haré <span className="text-indigo-600 dark:text-indigo-400">{habito}</span>
        </p>
        <div className="border-t-2 border-dashed border-indigo-200 dark:border-indigo-900" />
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          - Tiny Habits (BJ Fogg)
        </p>
      </div>

      {/* Activation Button */}
      <Button
        onClick={handleActivateWDK}
        disabled={isActivated}
        className={`w-full ${
          isActivated
            ? "bg-green-600 hover:bg-green-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        } text-white`}
      >
        {isActivated ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Seguimiento Activado
          </>
        ) : (
          <>
            <Clock className="mr-2 h-4 w-4" />
            Activar Seguimiento WDK (24hs)
          </>
        )}
      </Button>

      {/* Info Text */}
      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        El agente te contactará mañana sin consumir recursos en tu dispositivo
      </p>
    </div>
  )
}
