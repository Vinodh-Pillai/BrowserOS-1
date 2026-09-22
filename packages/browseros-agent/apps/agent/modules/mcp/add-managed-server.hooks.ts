interface AddServerResponse {
  success: boolean
  serverName: string
  oauthUrl?: string
  apiKeyUrl?: string
}

export const useAddManagedServer = () => {
  return {
    trigger: async (_args: {
      serverName: string
    }): Promise<AddServerResponse> => ({
      success: false,
      serverName: _args.serverName,
    }),
    data: undefined as AddServerResponse | undefined,
    error: undefined,
    isMutating: false,
    reset: () => {},
  }
}
