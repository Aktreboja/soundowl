'use client';

import { useGetAuthStatusQuery } from '@/lib/store/soundcloudApi';

interface SoundCloudAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook to check if the user is authenticated with SoundCloud.
 * Uses RTK Query for automatic caching and revalidation.
 */
export function useSoundCloudAuth(): SoundCloudAuthState {
  const { data, isLoading, error, refetch } = useGetAuthStatusQuery();

  return {
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
    error: error ? new Error('Failed to check authentication status') : null,
    refresh: refetch,
  };
}

export default useSoundCloudAuth;
