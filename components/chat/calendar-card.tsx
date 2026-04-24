"use client"

import { Calendar, Clock, ExternalLink, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarCardProps {
  titulo: string
  fechaHoraInicio?: string
  duracionMinutos?: number
  link?: string
  success?: boolean
  error?: string
  demo?: boolean
  // Legacy props for backwards compatibility
  date?: string
  time?: string
  location?: string
}

export function CalendarCard({
  titulo,
  fechaHoraInicio,
  duracionMinutos,
  link,
  success = true,
  error,
  demo = false,
  // Legacy props
  date,
  time,
}: CalendarCardProps) {
  // Format date and time from ISO string
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return { fecha: date || "", hora: time || "" }
    
    const dateObj = new Date(isoString)
    const fecha = dateObj.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const hora = dateObj.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
    
    return { fecha, hora }
  }

  const { fecha, hora } = formatDateTime(fechaHoraInicio)

  // Error state
  if (!success || error) {
    return (
      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5">
          <AlertCircle className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">Error de Calendario</span>
        </div>
        <div className="p-4">
          <h4 className="text-base font-semibold text-gray-900">{titulo}</h4>
          <p className="mt-2 text-sm text-red-600">
            {error || "No se pudo crear el evento. Verifica tu conexión con Google Calendar."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Google Calendar Style Header */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-2.5",
        demo 
          ? "bg-gradient-to-r from-amber-500 to-orange-500" 
          : "bg-gradient-to-r from-blue-500 to-blue-600"
      )}>
        <Calendar className="h-4 w-4 text-white" />
        <span className="text-sm font-medium text-white">
          {demo ? "Modo Demo" : "Google Calendar"}
        </span>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5">
          <Check className="h-3 w-3 text-white" />
          <span className="text-xs text-white">{demo ? "Vista previa" : "Creado"}</span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h4 className="text-base font-semibold text-gray-900">{titulo}</h4>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="capitalize">{fecha}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>
              {hora}
              {duracionMinutos && ` (${duracionMinutos} min)`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
              "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
              "hover:from-blue-600 hover:to-blue-700 hover:shadow-md",
              "active:scale-[0.98]"
            )}
          >
            <ExternalLink className="h-4 w-4" />
            Abrir en Google Calendar
          </a>
        )}

        {!link && (
          <div className={cn(
            "mt-4 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium",
            demo 
              ? "bg-amber-50 border border-amber-200 text-amber-700"
              : "bg-green-50 border border-green-200 text-green-700"
          )}>
            <Check className="h-4 w-4" />
            {demo ? "Configura Clerk para crear eventos reales" : "Evento agregado a tu calendario"}
          </div>
        )}
      </div>
    </div>
  )
}
