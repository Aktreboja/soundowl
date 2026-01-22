'use client';

import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { Navbar } from './Navbar';
import {useGetAccountQuery } from '@/lib/store/accountApi';
import {useUser} from '@auth0/nextjs-auth0/client';

/**
 * Wrapper component that only renders the Navbar when the user is authenticated with Spotify.
 */
export function AuthenticatedNavbar() {
  const { isAuthenticated, isLoading } = useSpotifyAuth();
  const { user } = useUser();
  const { data: account } = useGetAccountQuery({ email: user?.email ?? '' });


  // Don't render anything while checking auth status or if not authenticated
  if (isLoading || !isAuthenticated || !account?.hasRegistered) {
    return null;
  }

  
  return <Navbar />;
}

export default AuthenticatedNavbar;
