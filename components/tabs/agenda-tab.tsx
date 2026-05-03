"use client"

import { useState } from "react"
import { Clock, Flame, Droplets, Dumbbell, Coffee, Moon, Utensils, Calendar, Check, Trash2, Footprints, ExternalLink, BookOpen, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNeuroCoach, ScheduledEvent } from "@/lib/neurocoach-context"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  BookOpen: <BookOpen className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
}

function formatTime(isoDate: string, locale: string): string {
  const date = new Date(isoDate)
  return date.toLocaleTimeString(locale === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { 
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

// Generate Google Calendar URL for an event
function generateGoogleCalendarUrl(event: ScheduledEvent): string {
  const startDate = new Date(event.dateTime)
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60000)
  
  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: event.description || `Creado desde NeuroCoach`,
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function AgendaTab() {
  const { events, toggleEventCompletion, removeEvent } = useNeuroCoach()
  const { t, locale } = useI18n()
  const [googleCalendarDialogOpen, setGoogleCalendarDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null)
  
  // Filter to today and future events, sorted by date
  const upcomingEvents = events
    .filter(e => isFuture(e.dateTime))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
  
  const todayEvents = upcomingEvents.filter(e => isToday(e.dateTime))
  const futureEvents = upcomingEvents.filter(e => !isToday(e.dateTime))
  
  const completedTodayCount = todayEvents.filter(e => e.completed).length

  // Get today's formatted date
  const todayFormatted = formatDate(new Date().toISOString(), locale)

  const handleAddToGoogleCalendar = (event: ScheduledEvent) => {
    setSelectedEvent(event)
    setGoogleCalendarDialogOpen(true)
  }

  const confirmAddToGoogleCalendar = () => {
    if (selectedEvent) {
      const url = generateGoogleCalendarUrl(selectedEvent)
      window.open(url, '_blank')
      setGoogleCalendarDialogOpen(false)
      setSelectedEvent(null)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("agendaTitle")}</h2>
            <p className="text-sm text-muted-foreground capitalize">{todayFormatted}</p>
          </div>
          {todayEvents.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {completedTodayCount}/{todayEvents.length}
              </span>
            </div>
          )}
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/50 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">{t("noEventsToday")}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {t("startChatHint")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today's Events */}
            {todayEvents.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">{t("today")}</h3>
                <div className="relative space-y-0">
                  {todayEvents.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4 pb-4">
                      {/* Timeline Line */}
                      {index < todayEvents.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-[19px] top-10 h-full w-0.5",
                            event.completed ? "bg-green-300 dark:bg-green-700" : "bg-border"
                          )}
                        />
                      )}

                      {/* Time */}
                      <div className="w-12 shrink-0 pt-2 text-sm font-medium text-muted-foreground">
                        {formatTime(event.dateTime, locale)}
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
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4
                              className={cn(
                                "font-medium",
                                event.completed ? "text-green-800 dark:text-green-300" : ""
                              )}
                            >
                              {event.title}
                            </h4>
                            {event.description && (
                              <p
                                className={cn(
                                  "mt-0.5 text-sm",
                                  event.completed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                                )}
                              >
                                {event.description}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                              {event.durationMinutes} min
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAddToGoogleCalendar(event)}
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                              title={t("syncWithGoogle")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeEvent(event.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleEventCompletion(event.id)}
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                                event.completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-muted-foreground/30 text-muted-foreground/30 hover:border-green-400 hover:text-green-400"
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
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">{t("upcoming")}</h3>
                <div className="space-y-3">
                  {futureEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                          event.color
                        )}
                      >
                        {iconMap[event.icon] || <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {formatDate(event.dateTime, locale)} - {formatTime(event.dateTime, locale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAddToGoogleCalendar(event)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          title={t("syncWithGoogle")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Calendar Dialog */}
      <Dialog open={googleCalendarDialogOpen} onOpenChange={setGoogleCalendarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("connectGoogleCalendar")}</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <>
                  {locale === 'es' 
                    ? `Se abrira Google Calendar para agregar "${selectedEvent.title}" a tu calendario.`
                    : `Google Calendar will open to add "${selectedEvent.title}" to your calendar.`
                  }
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setGoogleCalendarDialogOpen(false)}>
              {t("close")}
            </Button>
            <Button onClick={confirmAddToGoogleCalendar} className="gap-2">
              <Calendar className="h-4 w-4" />
              {t("syncWithGoogle")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
