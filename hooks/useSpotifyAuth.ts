'use client';

import { useGetAuthStatusQuery } from '@/lib/store/spotifyApi';

interface SpotifyAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook to check if the user is authenticated with Spotify.
 * Uses RTK Query for automatic caching and revalidation.
 */
export function useSpotifyAuth(): SpotifyAuthState {
  const { data, isLoading, error, refetch } = useGetAuthStatusQuery();

  return {
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
    error: error ? new Error('Failed to check authentication status') : null,
    refresh: refetch,
  };
}

export default useSpotifyAuth;
