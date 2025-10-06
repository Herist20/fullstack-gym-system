'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Cache data for 10 minutes
            gcTime: 10 * 60 * 1000,

            // Retry failed requests 2 times with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Don't refetch on window focus in production
            refetchOnWindowFocus: process.env.NODE_ENV === 'development',

            // Refetch on reconnect
            refetchOnReconnect: true,

            // Refetch on mount if data is stale
            refetchOnMount: true,
          },
          mutations: {
            // Retry mutations once
            retry: 1,

            // On error, log to Sentry in production
            onError: (error) => {
              if (process.env.NODE_ENV === 'production') {
                // Sentry will capture this automatically
                console.error('Mutation error:', error);
              }
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
