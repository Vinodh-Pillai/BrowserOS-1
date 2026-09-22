import type { LlmProviderConfig } from '@/lib/llm-providers/types'

export interface CreditsData {
  credits: number
  dailyLimit: number
}

export const CREDITS_QUERY_KEY = ['credits']

export const useCredits = () => {
  return {
    data: { credits: 0, dailyLimit: 0 } as CreditsData,
    isLoading: false,
    isError: false,
    error: undefined,
  }
}

export const useInvalidateCredits = () => {
  return () => {}
}

export const hasCreditsForProvider = (_provider: LlmProviderConfig): true => {
  return true
}
