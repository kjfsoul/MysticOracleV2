import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

type ApiOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

export const apiRequest = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
      credentials: 'include',
    });

    // For authentication endpoints and chart/tarot endpoints, special handling of 401
    if ((endpoint === '/api/auth/me' || 
         endpoint.includes('/api/astrology-charts/') ||
         endpoint.includes('/api/tarot-readings/')) && 
        response.status === 401) {
      console.log(`Bypassing auth for endpoint: ${endpoint}`);
      // Try again with the public endpoint if available
      if (endpoint.includes('/api/astrology-charts/birth-chart')) {
        console.log('Retrying with public birth chart endpoint');
        const publicResponse = await fetch('/api/public/birth-chart', {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body,
          credentials: 'include',
        });
        
        if (publicResponse.ok) {
          return publicResponse.json();
        }
      }
      
      if (endpoint.includes('/api/tarot-readings/zodiac-spread')) {
        console.log('Retrying with public zodiac spread endpoint');
        const publicResponse = await fetch('/api/public/zodiac-spread', {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body,
          credentials: 'include',
        });
        
        if (publicResponse.ok) {
          return publicResponse.json();
        }
      }
      
      return null; // Return null for unauthenticated users instead of throwing
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    
    // For auth endpoints, just return null on error
    if (endpoint === '/api/auth/me') {
      return null;
    }
    
    throw error;
  }
};

export const getQueryFn = (options: { on401?: 'returnNull' | 'returnEmptyArray' | 'throw' } = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    try {
      const data = await apiRequest(queryKey[0]);
      return data;
    } catch (error: any) {
      if (error.response?.status === 401 && options.on401) {
        if (options.on401 === 'returnNull') return null;
        if (options.on401 === 'returnEmptyArray') return [];
        throw error;
      }
      throw error;
    }
  };
};