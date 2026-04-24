"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarCardProps {
  title: string
  date: string
  time: string
  location?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function CalendarCard({
  title,
  date,
  time,
  location,
  onConfirm,
  onCancel,
}: CalendarCardProps) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "cancelled">("pending")

  const handleConfirm = () => {
    setStatus("confirmed")
    onConfirm?.()
  }

  const handleCancel = () => {
    setStatus("cancelled")
    onCancel?.()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Google Calendar Style Header */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5">
        <Calendar className="h-4 w-4 text-white" />
        <span className="text-sm font-medium text-white">Google Calendar</span>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Status or Actions */}
        {status === "pending" ? (
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Check className="h-4 w-4" />
              Confirmar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className={cn(
              "mt-4 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium",
              status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {status === "confirmed" ? (
              <>
                <Check className="h-4 w-4" />
                Evento confirmado
              </>
            ) : (
              <>
                <X className="h-4 w-4" />
                Evento cancelado
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
