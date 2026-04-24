"use client"

import { Check, Flame, Droplets, Moon, Dumbbell, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface Habit {
  id: string
  name: string
  icon: React.ReactNode
  streak: number
  completedToday: boolean
  color: string
}

const habits: Habit[] = [
  {
    id: "1",
    name: "Meditación matutina",
    icon: <Flame className="h-5 w-5" />,
    streak: 12,
    completedToday: true,
    color: "bg-orange-500",
  },
  {
    id: "2",
    name: "Beber 2L de agua",
    icon: <Droplets className="h-5 w-5" />,
    streak: 8,
    completedToday: true,
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "Dormir 8 horas",
    icon: <Moon className="h-5 w-5" />,
    streak: 5,
    completedToday: false,
    color: "bg-purple-500",
  },
  {
    id: "4",
    name: "Ejercicio 30 min",
    icon: <Dumbbell className="h-5 w-5" />,
    streak: 15,
    completedToday: false,
    color: "bg-green-500",
  },
  {
    id: "5",
    name: "Leer 20 páginas",
    icon: <BookOpen className="h-5 w-5" />,
    streak: 3,
    completedToday: false,
    color: "bg-amber-500",
  },
]

export function RitmosTab() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mis Ritmos</h2>
          <span className="text-sm text-gray-500">2/5 completados hoy</span>
        </div>

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
                {habit.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{habit.name}</h3>
                <p className="text-sm text-gray-500">
                  Racha: {habit.streak} días
                </p>
              </div>

              <button
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

        <button className="w-full rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600">
          + Agregar nuevo ritmo
        </button>
      </div>
    </div>
  )
}
