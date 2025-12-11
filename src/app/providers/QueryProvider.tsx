'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useAuthStateSync } from '@/domains/auth/hooks/useAuthQueries';

/**
 * Auth State Sync Component
 * - Supabase auth 상태 변경을 React Query 캐시에 동기화
 */
function AuthStateSync() {
  useAuthStateSync();
  return null;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthStateSync />
      {children}
    </QueryClientProvider>
  );
}
