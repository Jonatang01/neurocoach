"use client"

import { TrendingUp, Award, Target, Zap } from "lucide-react"
import { useNeuroCoach } from "@/lib/neurocoach-context"
import { useI18n } from "@/lib/i18n"

export function ProgresoTab() {
  const { habits, progress, getCompletedTodayCount } = useNeuroCoach()
  const { t } = useI18n()
  
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
            <p className="text-xs text-indigo-200">{t("completed")} {t("today").toLowerCase()}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-4 text-white">
            <Award className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{progress.bestStreak}</p>
            <p className="text-xs text-amber-200">{t("currentStreak")}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 text-white">
            <Target className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{progress.totalHabitsCompleted}</p>
            <p className="text-xs text-green-200">{t("completedHabits")}</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white">
            <Zap className="h-6 w-6 opacity-80" />
            <p className="mt-2 text-2xl font-bold">{progress.level}</p>
            <p className="text-xs text-purple-200">{t("currentLevel")}</p>
          </div>
        </div>

        {/* Points Progress */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{t("totalPoints")}</h3>
            <span className="text-sm font-medium text-primary">{progress.points} {t("points")}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${(progress.points % 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {100 - (progress.points % 100)} {t("points")} {t("pointsToNext")}
          </p>
        </div>

        {/* Weekly Progress */}
        {weeklyStats.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-4 font-semibold">{t("weeklyStats")}</h3>
            <div className="space-y-4">
              {weeklyStats.map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[60%]">{stat.label}</span>
                    <span className="text-muted-foreground">
                      {stat.value}/{stat.max} {t("days")}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
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
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-200">{t("pointsEarned")}</p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                +10 {t("points")} {t("completedHabits").toLowerCase()}, +5 {t("points")} {t("scheduledEvents").toLowerCase()}, +15 {t("points")} {t("fulfilledEvents").toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
