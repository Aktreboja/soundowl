'use client';

import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { Navbar } from './Navbar';

/**
 * Wrapper component that only renders the Navbar when the user is authenticated with Spotify.
 */
export function AuthenticatedNavbar() {
  const { isAuthenticated, isLoading } = useSpotifyAuth();

  // Don't render anything while checking auth status or if not authenticated
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <Navbar />;
}

export default AuthenticatedNavbar;
