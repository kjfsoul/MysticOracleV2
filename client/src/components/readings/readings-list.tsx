// Fetch readings data
  const { data: tarotReadings, isLoading: tarotLoading, error: tarotError } = useQuery({
    queryKey: ['/api/tarot-readings'],
    queryFn: getQueryFn({ on401: "returnEmptyArray" }),
    retry: (failureCount, error) => {
      // Don't retry on 401 authentication errors
      if ((error as any)?.response?.status === 401) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
    // Don't show error for 401 responses
    onError: (error) => {
      if (!(error as any)?.response?.status === 401) {
        console.error('Error fetching tarot readings:', error);
      }
    }
  });