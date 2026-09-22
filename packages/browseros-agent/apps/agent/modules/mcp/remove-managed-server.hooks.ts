interface RemoveServerResponse {
  success: boolean
  serverName: string
}

export const useRemoveManagedServer = () => {
  return {
    trigger: async (_args: {
      serverName: string
    }): Promise<RemoveServerResponse> => ({
      success: false,
      serverName: _args.serverName,
    }),
    data: undefined as RemoveServerResponse | undefined,
    error: undefined,
    isMutating: false,
    reset: () => {},
  }
}
