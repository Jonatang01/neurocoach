"use client"

import { TrendingUp, Award, Target, Zap } from "lucide-react"

interface StatBar {
  label: string
  value: number
  max: number
  color: string
}

const weeklyStats: StatBar[] = [
  { label: "Meditación", value: 6, max: 7, color: "bg-orange-500" },
  { label: "Hidratación", value: 5, max: 7, color: "bg-blue-500" },
  { label: "Sueño", value: 4, max: 7, color: "bg-purple-500" },
  { label: "Ejercicio", value: 7, max: 7, color: "bg-green-500" },
  { label: "Lectura", value: 3, max: 7, color: "bg-amber-500" },
]

export function ProgresoTab() {
  const totalCompleted = weeklyStats.reduce((acc, stat) => acc + stat.value, 0)
  const totalPossible = weeklyStats.reduce((acc, stat) => acc + stat.max, 0)
  const percentage = Math.round((totalCompleted / totalPossible) * 100)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
            <TrendingUp className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{percentage}%</p>
            <p className="text-xs text-indigo-200">Consistencia semanal</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white">
            <Award className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">15</p>
            <p className="text-xs text-amber-200">Mejor racha</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 text-white">
            <Target className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">89</p>
            <p className="text-xs text-green-200">Hábitos completados</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white">
            <Zap className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">4</p>
            <p className="text-xs text-purple-200">Nivel actual</p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-900">Progreso Semanal</h3>
          <div className="space-y-4">
            {weeklyStats.map((stat) => (
              <div key={stat.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{stat.label}</span>
                  <span className="text-gray-500">
                    {stat.value}/{stat.max} días
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full transition-all ${stat.color}`}
                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Teaser */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-amber-900">Próximo logro</p>
              <p className="text-sm text-amber-700">
                Completa 3 días más de ejercicio para desbloquear &quot;Atleta Constante&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
