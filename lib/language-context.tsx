'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ES' | 'EN'

const translations = {
  ES: {
    header: {
      subtitle: 'Tu coach de hábitos inteligente',
      changeLanguage: 'Cambiar idioma a English',
      changeTheme: 'Cambiar tema',
      faqTitle: '¿Cómo funciona NeuroCoach?',
      faqDesc: 'Descubre más sobre nuestro enfoque basado en neurociencia',
    },
    onboarding: {
      title: 'NeuroCoach: Tu espacio seguro para construir hábitos',
      subtitle: 'Basado en la ciencia conductual de James Clear y BJ Fogg.',
      helper: 'Elige una sugerencia o cuéntame tu desafío de hoy.',
      burnout: 'Burnout Laboral',
      burnoutDesc: 'Recupera tu energía',
      constancy: 'Falta de Constancia',
      constancyDesc: 'Crea ritmos sostenibles',
      stress: 'Estrés y Ansiedad',
      stressDesc: 'Técnicas basadas en neurociencia',
    },
    chat: {
      inputPlaceholder: 'Escribe tu respuesta...',
    },
  },
  EN: {
    header: {
      subtitle: 'Your intelligent habits coach',
      changeLanguage: 'Change language to Español',
      changeTheme: 'Change theme',
      faqTitle: 'How does NeuroCoach work?',
      faqDesc: 'Discover more about our science-based approach',
    },
    onboarding: {
      title: 'NeuroCoach: Your safe space to build habits',
      subtitle: 'Based on behavioral science by James Clear and BJ Fogg.',
      helper: 'Choose a suggestion or tell me your challenge today.',
      burnout: 'Work Burnout',
      burnoutDesc: 'Recover your energy',
      constancy: 'Lack of Consistency',
      constancyDesc: 'Create sustainable rhythms',
      stress: 'Stress and Anxiety',
      stressDesc: 'Science-based techniques',
    },
    chat: {
      inputPlaceholder: 'Write your message...',
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ES')

  useEffect(() => {
    const saved = localStorage.getItem('neurocoach-language') as Language
    if (saved) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('neurocoach-language', lang)
  }

  const t = (path: string): string => {
    const keys = path.split('.')
    let value: any = translations[language]
    for (const key of keys) {
      value = value[key]
    }
    return value || path
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
