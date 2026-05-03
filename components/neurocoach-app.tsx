'use client'

import { useState, useCallback } from 'react'
import { OnboardingScreen } from '@/components/onboarding-screen'
import { NeuroCoachInterface } from '@/components/neurocoach-interface'

export type Challenge = 'burnout' | 'constancy' | 'stress'

export function NeuroCoachApp() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const handleSelectChallenge = useCallback((selectedChallenge: Challenge) => {
    setChallenge(selectedChallenge)
  }, [])

  const handleReset = useCallback(() => {
    setChallenge(null)
  }, [])

  if (!challenge) {
    return <OnboardingScreen onSelect={handleSelectChallenge} />
  }

  return <NeuroCoachInterface challenge={challenge} onReset={handleReset} />
}
