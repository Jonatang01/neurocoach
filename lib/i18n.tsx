"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type Locale = "es" | "en"

const translations = {
  es: {
    // Header
    appName: "NeuroCoach",
    appTagline: "Tu coach de habitos inteligente",
    level: "Nivel",
    points: "pts",
    
    // Tabs
    chat: "Chat",
    rhythms: "Mis Ritmos",
    progress: "Progreso",
    agenda: "Agenda",
    
    // Ritmos Tab
    myRhythms: "Mis Ritmos",
    noHabits: "Aun no tienes habitos",
    startChatHint: "Habla con NeuroCoach para crear tu primer habito",
    markComplete: "Marcar como completado",
    delete: "Eliminar",
    completed: "Completado",
    
    // Progreso Tab
    progressTitle: "Tu Progreso",
    currentLevel: "Nivel Actual",
    totalPoints: "Puntos Totales",
    currentStreak: "Racha Actual",
    days: "dias",
    weeklyStats: "Estadisticas Semanales",
    completedHabits: "Habitos completados",
    scheduledEvents: "Eventos programados",
    fulfilledEvents: "Eventos cumplidos",
    pointsEarned: "Puntos ganados",
    levelProgress: "Progreso de Nivel",
    pointsToNext: "para el siguiente nivel",
    
    // Agenda Tab
    agendaTitle: "Mi Agenda",
    today: "Hoy",
    upcoming: "Proximos",
    noEventsToday: "No hay eventos para hoy",
    noUpcomingEvents: "No hay eventos programados",
    markFulfilled: "Marcar cumplido",
    fulfilled: "Cumplido",
    connectGoogleCalendar: "Conectar Google Calendar",
    syncWithGoogle: "Sincronizar con Google",
    
    // Chat
    chatPlaceholder: "Escribe tu mensaje...",
    send: "Enviar",
    
    // Help/Onboarding
    help: "Ayuda",
    howItWorks: "Como Funciona",
    helpStep1Title: "Habla con tu Coach",
    helpStep1Desc: "Cuentale a NeuroCoach que habitos quieres desarrollar. El te guiara con consejos basados en neurociencia.",
    helpStep2Title: "Crea Compromisos",
    helpStep2Desc: "Cuando estes listo, di 'Me comprometo a...' para crear un Contrato de Identidad visual.",
    helpStep3Title: "Agenda Eventos",
    helpStep3Desc: "Pide a NeuroCoach que agende tus actividades. Puedes sincronizarlas con Google Calendar.",
    helpStep4Title: "Registra tu Progreso",
    helpStep4Desc: "Marca tus habitos y eventos completados para ganar puntos y subir de nivel.",
    close: "Cerrar",
    
    // Settings
    settings: "Ajustes",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    language: "Idioma",
    spanish: "Espanol",
    english: "Ingles",
    
    // Calendar Card
    googleCalendar: "Google Calendar",
    created: "Creado",
    demoMode: "Modo Demo",
    preview: "Vista previa",
    openInGoogleCalendar: "Abrir en Google Calendar",
    eventAddedToCalendar: "Evento agregado a tu calendario",
    configureClerkForRealEvents: "Configura Clerk para crear eventos reales",
    
    // Contract
    identityContract: "Contrato de Identidad",
    myNewIdentity: "Mi Nueva Identidad",
    after: "Despues de",
    iWillDo: "Voy a",
    signedOn: "Firmado el",
    basedOn: "Basado en Tiny Habits de BJ Fogg",
  },
  en: {
    // Header
    appName: "NeuroCoach",
    appTagline: "Your intelligent habit coach",
    level: "Level",
    points: "pts",
    
    // Tabs
    chat: "Chat",
    rhythms: "My Rhythms",
    progress: "Progress",
    agenda: "Agenda",
    
    // Ritmos Tab
    myRhythms: "My Rhythms",
    noHabits: "You don't have any habits yet",
    startChatHint: "Talk to NeuroCoach to create your first habit",
    markComplete: "Mark as complete",
    delete: "Delete",
    completed: "Completed",
    
    // Progreso Tab
    progressTitle: "Your Progress",
    currentLevel: "Current Level",
    totalPoints: "Total Points",
    currentStreak: "Current Streak",
    days: "days",
    weeklyStats: "Weekly Stats",
    completedHabits: "Completed habits",
    scheduledEvents: "Scheduled events",
    fulfilledEvents: "Fulfilled events",
    pointsEarned: "Points earned",
    levelProgress: "Level Progress",
    pointsToNext: "to next level",
    
    // Agenda Tab
    agendaTitle: "My Agenda",
    today: "Today",
    upcoming: "Upcoming",
    noEventsToday: "No events for today",
    noUpcomingEvents: "No scheduled events",
    markFulfilled: "Mark fulfilled",
    fulfilled: "Fulfilled",
    connectGoogleCalendar: "Connect Google Calendar",
    syncWithGoogle: "Sync with Google",
    
    // Chat
    chatPlaceholder: "Type your message...",
    send: "Send",
    
    // Help/Onboarding
    help: "Help",
    howItWorks: "How It Works",
    helpStep1Title: "Talk to Your Coach",
    helpStep1Desc: "Tell NeuroCoach what habits you want to develop. It will guide you with neuroscience-based advice.",
    helpStep2Title: "Create Commitments",
    helpStep2Desc: "When ready, say 'I commit to...' to create a visual Identity Contract.",
    helpStep3Title: "Schedule Events",
    helpStep3Desc: "Ask NeuroCoach to schedule your activities. You can sync them with Google Calendar.",
    helpStep4Title: "Track Your Progress",
    helpStep4Desc: "Mark your completed habits and events to earn points and level up.",
    close: "Close",
    
    // Settings
    settings: "Settings",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    spanish: "Spanish",
    english: "English",
    
    // Calendar Card
    googleCalendar: "Google Calendar",
    created: "Created",
    demoMode: "Demo Mode",
    preview: "Preview",
    openInGoogleCalendar: "Open in Google Calendar",
    eventAddedToCalendar: "Event added to your calendar",
    configureClerkForRealEvents: "Configure Clerk for real events",
    
    // Contract
    identityContract: "Identity Contract",
    myNewIdentity: "My New Identity",
    after: "After",
    iWillDo: "I will",
    signedOn: "Signed on",
    basedOn: "Based on Tiny Habits by BJ Fogg",
  },
} as const

type TranslationKey = keyof typeof translations.es

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      localStorage.setItem("neurocoach-locale", newLocale)
    }
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] || key
  }, [locale])

  // Load saved locale on mount
  if (typeof window !== "undefined") {
    const savedLocale = localStorage.getItem("neurocoach-locale") as Locale | null
    if (savedLocale && savedLocale !== locale && (savedLocale === "es" || savedLocale === "en")) {
      setLocaleState(savedLocale)
    }
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
