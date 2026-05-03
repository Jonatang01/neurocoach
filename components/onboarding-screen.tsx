'use client'

import { useState } from 'react'
import { Battery, Calendar, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface OnboardingScreenProps {
  onSelect: (challenge: 'burnout' | 'constancy' | 'stress') => void
}

export function OnboardingScreen({ onSelect }: OnboardingScreenProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)

  const challenges = [
    {
      id: 'burnout',
      title: 'Burnout Laboral',
      icon: Battery,
      description: 'Me siento agotado por el trabajo constante',
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'constancy',
      title: 'Falta de Constancia',
      icon: Calendar,
      description: 'Tengo dificultad mantener rutinas',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'stress',
      title: 'Estrés y Ansiedad',
      icon: Zap,
      description: 'Necesito herramientas para calmar la mente',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const handleSelect = (id: string) => {
    setSelectedChallenge(id)
    setTimeout(() => {
      onSelect(id as 'burnout' | 'constancy' | 'stress')
    }, 300)
  }

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-stone-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Descubre tu punto de fricción
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            NeuroCoach adapta la ciencia conductual a tu realidad. ¿Qué desafío enfrentas hoy?
          </p>
        </div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {challenges.map((challenge) => {
            const Icon = challenge.icon
            const isSelected = selectedChallenge === challenge.id

            return (
              <button
                key={challenge.id}
                onClick={() => handleSelect(challenge.id)}
                className={`group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-emerald-600 ring-offset-2'
                    : 'hover:shadow-lg'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-10 group-hover:opacity-15 transition-opacity dark:opacity-20 dark:group-hover:opacity-25`} />

                {/* Content */}
                <div className="relative space-y-4">
                  <div className={`inline-block rounded-lg bg-gradient-to-br ${challenge.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Border and hover effect */}
                <div className="absolute inset-0 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors group-hover:border-slate-300 dark:group-hover:border-slate-600" />
              </button>
            )
          })}
        </div>

        {/* CTA Text */}
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Selecciona una tarjeta para continuar
          </p>
        </div>
      </div>
    </div>
  )
}
