export const useGetUserMCPIntegrations = () => {
  return {
    data: {
      integrations: [] as { name: string; is_authenticated: boolean }[],
      count: 0,
    },
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    mutate: () => {},
  }
}
