import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useApi(
  endpoint: string, 
  options: { 
    enabled?: boolean, 
    requireAuth?: boolean,
    onUnauthorized?: 'returnNull' | 'returnEmptyArray' | 'throw' 
  } = {}
) {
  const { requireAuth = false, onUnauthorized = 'throw', ...restOptions } = options;

  return useQuery({
    queryKey: [endpoint],
    queryFn: getQueryFn({ on401: onUnauthorized }),
    retry: (failureCount, error) => {
      // Don't retry auth errors if specified
      if (requireAuth && (error as any)?.response?.status === 401) {
        return false;
      }
      return failureCount < 3; // Retry other errors up to 3 times
    },
    ...restOptions,
  });
}