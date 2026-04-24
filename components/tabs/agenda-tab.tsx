"use client"

import { Clock, Flame, Droplets, Dumbbell, Coffee, Moon, Utensils } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  id: string
  time: string
  title: string
  description?: string
  icon: React.ReactNode
  color: string
  completed: boolean
}

const todayEvents: TimelineEvent[] = [
  {
    id: "1",
    time: "06:30",
    title: "Despertar y meditación",
    description: "10 minutos de mindfulness",
    icon: <Flame className="h-4 w-4" />,
    color: "bg-orange-500",
    completed: true,
  },
  {
    id: "2",
    time: "07:00",
    title: "Primer vaso de agua",
    icon: <Droplets className="h-4 w-4" />,
    color: "bg-blue-500",
    completed: true,
  },
  {
    id: "3",
    time: "08:00",
    title: "Desayuno saludable",
    description: "Avena con frutas",
    icon: <Utensils className="h-4 w-4" />,
    color: "bg-green-500",
    completed: true,
  },
  {
    id: "4",
    time: "12:00",
    title: "Pausa activa",
    description: "5 min de estiramientos",
    icon: <Coffee className="h-4 w-4" />,
    color: "bg-amber-500",
    completed: false,
  },
  {
    id: "5",
    time: "17:00",
    title: "Fútbol",
    description: "Partido con amigos",
    icon: <Dumbbell className="h-4 w-4" />,
    color: "bg-indigo-500",
    completed: false,
  },
  {
    id: "6",
    time: "22:00",
    title: "Rutina de sueño",
    description: "Sin pantallas, lectura ligera",
    icon: <Moon className="h-4 w-4" />,
    color: "bg-purple-500",
    completed: false,
  },
]

export function AgendaTab() {
  const completedCount = todayEvents.filter((e) => e.completed).length

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Agenda de Hoy</h2>
            <p className="text-sm text-gray-500">Martes, 24 de diciembre</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">
              {completedCount}/{todayEvents.length}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative space-y-0">
          {todayEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4 pb-6">
              {/* Timeline Line */}
              {index < todayEvents.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[19px] top-10 h-full w-0.5",
                    event.completed ? "bg-green-300" : "bg-gray-200"
                  )}
                />
              )}

              {/* Time */}
              <div className="w-12 shrink-0 pt-2 text-sm font-medium text-gray-500">
                {event.time}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                  event.completed ? "bg-green-500" : event.color
                )}
              >
                {event.icon}
              </div>

              {/* Content */}
              <div
                className={cn(
                  "flex-1 rounded-xl border p-3 transition-all",
                  event.completed
                    ? "border-green-200 bg-green-50/50"
                    : "border-gray-200 bg-white"
                )}
              >
                <h4
                  className={cn(
                    "font-medium",
                    event.completed ? "text-green-800" : "text-gray-900"
                  )}
                >
                  {event.title}
                </h4>
                {event.description && (
                  <p
                    className={cn(
                      "mt-0.5 text-sm",
                      event.completed ? "text-green-600" : "text-gray-500"
                    )}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
