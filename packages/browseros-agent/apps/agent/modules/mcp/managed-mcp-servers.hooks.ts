export const useGetMCPServersList = () => {
  return {
    data: { servers: [] as { name: string; description: string }[], count: 0 },
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    mutate: () => {},
  }
}
