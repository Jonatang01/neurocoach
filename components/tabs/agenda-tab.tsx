"use client"

import { Clock, Flame, Droplets, Dumbbell, Coffee, Moon, Utensils, Calendar, Check, Trash2, Footprints } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNeuroCoach } from "@/lib/neurocoach-context"

// Icon map for dynamic rendering
const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-4 w-4" />,
  Droplets: <Droplets className="h-4 w-4" />,
  Dumbbell: <Dumbbell className="h-4 w-4" />,
  Coffee: <Coffee className="h-4 w-4" />,
  Moon: <Moon className="h-4 w-4" />,
  Utensils: <Utensils className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  Footprints: <Footprints className="h-4 w-4" />,
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
}

function isToday(isoDate: string): boolean {
  const date = new Date(isoDate)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isFuture(isoDate: string): boolean {
  const date = new Date(isoDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}

export function AgendaTab() {
  const { events, toggleEventCompletion, removeEvent } = useNeuroCoach()
  
  // Filter to today and future events, sorted by date
  const upcomingEvents = events
    .filter(e => isFuture(e.dateTime))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
  
  const todayEvents = upcomingEvents.filter(e => isToday(e.dateTime))
  const futureEvents = upcomingEvents.filter(e => !isToday(e.dateTime))
  
  const completedTodayCount = todayEvents.filter(e => e.completed).length

  // Get today's formatted date
  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Mi Agenda</h2>
            <p className="text-sm text-gray-500 capitalize">{todayFormatted}</p>
          </div>
          {todayEvents.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">
                {completedTodayCount}/{todayEvents.length}
              </span>
            </div>
          )}
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-3 text-gray-500">No tienes eventos programados.</p>
            <p className="mt-1 text-sm text-gray-400">
              Dile a NeuroCoach &quot;Agéndame correr el sábado a las 7am&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today's Events */}
            {todayEvents.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Hoy</h3>
                <div className="relative space-y-0">
                  {todayEvents.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4 pb-4">
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
                        {formatTime(event.dateTime)}
                      </div>

                      {/* Icon */}
                      <div
                        className={cn(
                          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                          event.completed ? "bg-green-500" : event.color
                        )}
                      >
                        {iconMap[event.icon] || <Calendar className="h-4 w-4" />}
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
                        <div className="flex items-start justify-between">
                          <div>
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
                            <p className="mt-1 text-xs text-gray-400">
                              {event.durationMinutes} min
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => removeEvent(event.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleEventCompletion(event.id)}
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                                event.completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-gray-300 text-gray-300 hover:border-green-400 hover:text-green-400"
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Future Events */}
            {futureEvents.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Próximos</h3>
                <div className="space-y-3">
                  {futureEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                          event.color
                        )}
                      >
                        {iconMap[event.icon] || <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {formatDate(event.dateTime)} - {formatTime(event.dateTime)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
