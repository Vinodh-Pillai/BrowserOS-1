// Stubbed: JTBD survey disabled for local deployment hardening.
import { useState } from 'react'

export interface SurveyChatOptions {
  maxTurns?: number
  experimentId?: string
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function useChat(_options: SurveyChatOptions = {}) {
  const [phase] = useState<'idle' | 'active' | 'completed' | 'error'>('idle')
  const [messages] = useState<Message[]>([])
  const [isStreaming] = useState(false)
  const [error] = useState<Error | null>(null)

  return {
    phase,
    messages,
    isStreaming,
    error,
    start: async () => {},
    respond: async (_text: string) => {},
    stop: () => {},
    reset: () => {},
  }
}
