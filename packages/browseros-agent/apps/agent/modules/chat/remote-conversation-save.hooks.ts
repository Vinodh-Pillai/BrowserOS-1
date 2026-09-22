// Stubbed: remote conversation save disabled for local deployment hardening.
import type { UIMessage } from 'ai'
import { useCallback } from 'react'

export function useRemoteConversationSave() {
  const noop = useCallback(async () => {}, [])

  return {
    isLoggedIn: false,
    saveConversation: noop as unknown as (
      conversationId: string,
      messages: UIMessage[],
    ) => Promise<void>,
    resetConversation: () => {},
    markMessagesAsSaved: (
      _conversationId: string,
      _messages: UIMessage[],
    ) => {},
  }
}
