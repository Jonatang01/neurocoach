"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react"
import { Mic, MicOff, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  input: string
  setInput: (input: string) => void
  onSendMessage: (text: string) => void
  disabled?: boolean
}

export function ChatInput({
  input,
  setInput,
  onSendMessage,
  disabled,
}: ChatInputProps) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for suggestion events from ChatArea
  useEffect(() => {
    const handler = (e: Event) => {
      const suggestion = (e as CustomEvent).detail as string
      onSendMessage(suggestion)
    }
    window.addEventListener("neurocoach:suggest", handler)
    return () => window.removeEventListener("neurocoach:suggest", handler)
  }, [onSendMessage])

  // Initialize Web Speech API
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition })
        .webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.")
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = "es-ES"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [setInput])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const handleMicToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-lg items-center gap-2"
      >
        {/* Microphone Button (Push-to-Talk) */}
        <button
          type="button"
          onClick={handleMicToggle}
          disabled={disabled}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
            isListening
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isListening ? "Detener grabación" : "Grabar mensaje de voz"}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Escuchando..." : "Escribe un mensaje..."}
          disabled={disabled || isListening}
          className={cn(
            "h-10 flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500",
            "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isListening && "border-red-300 bg-red-50/50"
          )}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
            input.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-100 text-gray-400"
          )}
          aria-label="Enviar mensaje"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
