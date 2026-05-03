"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

// Types
export interface Habit {
  id: string
  name: string
  icon: string // nombre del icono de lucide
  color: string
  streak: number
  completedToday: boolean
  completedDates: string[] // ISO dates
  ancla?: string // para contratos
  createdAt: string
}

export interface ScheduledEvent {
  id: string
  title: string
  description?: string
  dateTime: string // ISO datetime
  durationMinutes: number
  icon: string
  color: string
  completed: boolean
  source: "chat" | "manual"
}

export interface UserProgress {
  level: number
  points: number
  totalHabitsCompleted: number
  bestStreak: number
  weeklyCompletions: Record<string, number> // habitId -> completions this week
}

interface NeuroCoachState {
  habits: Habit[]
  events: ScheduledEvent[]
  progress: UserProgress
}

interface NeuroCoachContextType extends NeuroCoachState {
  // Habit actions
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completedToday" | "completedDates" | "createdAt">) => void
  toggleHabitCompletion: (habitId: string) => void
  removeHabit: (habitId: string) => void
  
  // Event actions
  addEvent: (event: Omit<ScheduledEvent, "id" | "completed">) => void
  toggleEventCompletion: (eventId: string) => void
  removeEvent: (eventId: string) => void
  
  // Progress actions
  addPoints: (points: number) => void
  
  // Utility
  getTodayEvents: () => ScheduledEvent[]
  getCompletedTodayCount: () => number
}

// Initial demo data
const initialHabits: Habit[] = [
  {
    id: "h1",
    name: "Meditación matutina",
    icon: "Flame",
    color: "bg-orange-500",
    streak: 12,
    completedToday: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "h2",
    name: "Beber 2L de agua",
    icon: "Droplets",
    color: "bg-blue-500",
    streak: 8,
    completedToday: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "h3",
    name: "Ejercicio 30 min",
    icon: "Dumbbell",
    color: "bg-green-500",
    streak: 15,
    completedToday: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "h4",
    name: "Leer 20 páginas",
    icon: "BookOpen",
    color: "bg-amber-500",
    streak: 3,
    completedToday: false,
    completedDates: [],
    createdAt: new Date().toISOString(),
  },
]

const initialEvents: ScheduledEvent[] = []

const initialProgress: UserProgress = {
  level: 1,
  points: 0,
  totalHabitsCompleted: 0,
  bestStreak: 15,
  weeklyCompletions: {},
}

const NeuroCoachContext = createContext<NeuroCoachContextType | null>(null)

export function NeuroCoachProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [events, setEvents] = useState<ScheduledEvent[]>(initialEvents)
  const [progress, setProgress] = useState<UserProgress>(initialProgress)

  // Habit actions
  const addHabit = useCallback((habitData: Omit<Habit, "id" | "streak" | "completedToday" | "completedDates" | "createdAt">) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h${Date.now()}`,
      streak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
    setHabits(prev => [...prev, newHabit])
  }, [])

  const toggleHabitCompletion = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit
      
      const wasCompleted = habit.completedToday
      const newCompletedToday = !wasCompleted
      
      let newStreak = habit.streak
      let newCompletedDates = [...habit.completedDates]
      
      if (newCompletedToday) {
        newStreak = habit.streak + 1
        if (!newCompletedDates.includes(today)) {
          newCompletedDates.push(today)
        }
      } else {
        newStreak = Math.max(0, habit.streak - 1)
        newCompletedDates = newCompletedDates.filter(d => d !== today)
      }
      
      return {
        ...habit,
        completedToday: newCompletedToday,
        streak: newStreak,
        completedDates: newCompletedDates,
      }
    }))
    
    // Update points
    setProgress(prev => {
      const habit = habits.find(h => h.id === habitId)
      const wasCompleted = habit?.completedToday ?? false
      const pointChange = wasCompleted ? -10 : 10
      const newPoints = Math.max(0, prev.points + pointChange)
      const newLevel = Math.floor(newPoints / 100) + 1
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        totalHabitsCompleted: wasCompleted 
          ? prev.totalHabitsCompleted - 1 
          : prev.totalHabitsCompleted + 1,
      }
    })
  }, [habits])

  const removeHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }, [])

  // Event actions
  const addEvent = useCallback((eventData: Omit<ScheduledEvent, "id" | "completed">) => {
    const newEvent: ScheduledEvent = {
      ...eventData,
      id: `e${Date.now()}`,
      completed: false,
    }
    setEvents(prev => [...prev, newEvent].sort((a, b) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    ))
    
    // Bonus points for scheduling
    setProgress(prev => ({
      ...prev,
      points: prev.points + 5,
    }))
  }, [])

  const toggleEventCompletion = useCallback((eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id !== eventId) return event
      return { ...event, completed: !event.completed }
    }))
    
    // Points for completing events
    setProgress(prev => {
      const event = events.find(e => e.id === eventId)
      const wasCompleted = event?.completed ?? false
      const pointChange = wasCompleted ? -15 : 15
      
      return {
        ...prev,
        points: Math.max(0, prev.points + pointChange),
      }
    })
  }, [events])

  const removeEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }, [])

  // Progress actions
  const addPoints = useCallback((points: number) => {
    setProgress(prev => {
      const newPoints = prev.points + points
      const newLevel = Math.floor(newPoints / 100) + 1
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      }
    })
  }, [])

  // Utility functions
  const getTodayEvents = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.filter(e => e.dateTime.startsWith(today))
  }, [events])

  const getCompletedTodayCount = useCallback(() => {
    return habits.filter(h => h.completedToday).length
  }, [habits])

  const value: NeuroCoachContextType = {
    habits,
    events,
    progress,
    addHabit,
    toggleHabitCompletion,
    removeHabit,
    addEvent,
    toggleEventCompletion,
    removeEvent,
    addPoints,
    getTodayEvents,
    getCompletedTodayCount,
  }

  return (
    <NeuroCoachContext.Provider value={value}>
      {children}
    </NeuroCoachContext.Provider>
  )
}

export function useNeuroCoach() {
  const context = useContext(NeuroCoachContext)
  if (!context) {
    throw new Error("useNeuroCoach must be used within a NeuroCoachProvider")
  }
  return context
}
