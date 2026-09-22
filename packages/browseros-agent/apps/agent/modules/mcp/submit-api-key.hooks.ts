interface SubmitApiKeyResponse {
  success: boolean
  serverName: string
}

export const useSubmitApiKey = () => {
  return {
    trigger: async (_args: {
      serverName: string
      apiKey: string
      apiKeyUrl: string
    }): Promise<SubmitApiKeyResponse> => ({
      success: false,
      serverName: _args.serverName,
    }),
    data: undefined as SubmitApiKeyResponse | undefined,
    error: undefined,
    isMutating: false,
    reset: () => {},
  }
}
