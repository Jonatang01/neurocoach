"use client"

import { Check, Flame, Droplets, Moon, Dumbbell, BookOpen, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNeuroCoach } from "@/lib/neurocoach-context"

// Icon map for dynamic rendering
const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  Moon: <Moon className="h-5 w-5" />,
  Dumbbell: <Dumbbell className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
}

export function RitmosTab() {
  const { habits, toggleHabitCompletion, removeHabit, getCompletedTodayCount } = useNeuroCoach()
  
  const completedCount = getCompletedTodayCount()

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mis Ritmos</h2>
          <span className="text-sm text-gray-500">{completedCount}/{habits.length} completados hoy</span>
        </div>

        {habits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">No tienes ritmos configurados.</p>
            <p className="mt-1 text-sm text-gray-400">
              Habla con NeuroCoach para crear tu primer hábito.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all",
                  habit.completedToday
                    ? "border-green-200 bg-green-50/50"
                    : "border-gray-200"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-white",
                    habit.color
                  )}
                >
                  {iconMap[habit.icon] || <Flame className="h-5 w-5" />}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{habit.name}</h3>
                  <p className="text-sm text-gray-500">
                    Racha: {habit.streak} días
                  </p>
                </div>

                <button
                  onClick={() => removeHabit(habit.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Eliminar hábito"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    habit.completedToday
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 text-gray-300 hover:border-indigo-400 hover:text-indigo-400"
                  )}
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm text-indigo-700">
            <span className="font-medium">Tip:</span> Dile a NeuroCoach &quot;Me comprometo a [hábito] después de [rutina]&quot; para crear un nuevo ritmo con contrato.
          </p>
        </div>
      </div>
    </div>
  )
}
