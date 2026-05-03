"use client"

import { TrendingUp, Award, Target, Zap } from "lucide-react"
import { useNeuroCoach } from "@/lib/neurocoach-context"

export function ProgresoTab() {
  const { habits, progress, getCompletedTodayCount } = useNeuroCoach()
  
  const completedToday = getCompletedTodayCount()
  const totalHabits = habits.length
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  // Calculate weekly stats from habits
  const weeklyStats = habits.map(habit => ({
    label: habit.name,
    value: habit.completedDates.filter(date => {
      const d = new Date(date)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return d >= weekAgo
    }).length,
    max: 7,
    color: habit.color,
  }))

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white">
            <TrendingUp className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{percentage}%</p>
            <p className="text-xs text-indigo-200">Completado hoy</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white">
            <Award className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{progress.bestStreak}</p>
            <p className="text-xs text-amber-200">Mejor racha</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 text-white">
            <Target className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{progress.totalHabitsCompleted}</p>
            <p className="text-xs text-green-200">Hábitos completados</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white">
            <Zap className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{progress.level}</p>
            <p className="text-xs text-purple-200">Nivel actual</p>
          </div>
        </div>

        {/* Points Progress */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Puntos de Experiencia</h3>
            <span className="text-sm font-medium text-indigo-600">{progress.points} pts</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${(progress.points % 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {100 - (progress.points % 100)} pts para el siguiente nivel
          </p>
        </div>

        {/* Weekly Progress */}
        {weeklyStats.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Progreso Semanal</h3>
            <div className="space-y-4">
              {weeklyStats.map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 truncate max-w-[60%]">{stat.label}</span>
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
        )}

        {/* Achievement Teaser */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-amber-900">Sistema de puntos</p>
              <p className="text-sm text-amber-700">
                +10 pts por completar hábito, +5 pts por agendar, +15 pts por cumplir evento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
