'use client';
import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Box, Spinner } from '@chakra-ui/react';
import { useSoundCloudAuth } from '@/hooks/useSoundCloudAuth';
import {
  useGetSoundCloudLikedTracksQuery,
  useGetSoundCloudProfileQuery,
  useGetSoundCloudActivitiesQuery,
} from '@/lib/store/soundcloudApi';
import {
  ActivityFeed,
  LikedTracks,
  SoundCloudProfile,
} from '@/components/Soundcloud';
import UniversalSearch from '@/components/Dashboard/UniversalSearch';

export default function SoundCloudPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useSoundCloudAuth();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetSoundCloudProfileQuery(undefined, {
    skip: !isAuthenticated, // Skip query if not authenticated
  });

  const { data: likedTracks = [] } = useGetSoundCloudLikedTracksQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  const { data: activities } = useGetSoundCloudActivitiesQuery(undefined, {
    skip: !isAuthenticated,
  });

  console.log('Liked Tracks', likedTracks);
  console.log('Activities', activities);
  const error = useMemo(() => {
    const errorParam = searchParams.get('error');
    return errorParam ? `Authentication error: ${errorParam}` : null;
  }, [searchParams]);

  const handleGetStarted = () => {
    router.push('/api/soundcloud/auth');
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error screen
  if (error && !isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Box className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-center">
            Welcome to SoundCloud
          </h1>
          <div className="action-card">
            <p className="action-text">{error}</p>
            <Button onClick={handleGetStarted} colorPalette="blue">
              Try Again
            </Button>
          </div>
        </Box>
      </div>
    );
  }

  // Authenticated state - show user information
  if (isAuthenticated) {
    if (profileLoading) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    if (profileError || !profile) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Box className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-center">
              Welcome to SoundCloud
            </h1>
            <p className="text-red-500">
              Failed to load profile. Please try logging in again.
            </p>
            <Button onClick={handleGetStarted} colorPalette="blue">
              Login Again
            </Button>
          </Box>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        {/* Activity feed section */}

        <SoundCloudProfile profile={profile} />
        <UniversalSearch />
        <LikedTracks likedTracks={likedTracks} />
        <ActivityFeed activities={activities?.collection || []} />
      </div>
    );
  }

  // Welcome screen for unauthenticated users
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Box className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold text-center">
          Welcome to SoundCloud
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Connect your SoundCloud account to get started
        </p>
        <Button
          onClick={handleGetStarted}
          colorPalette="orange"
          size="lg"
          variant="solid"
        >
          Get Started
        </Button>
      </Box>
    </div>
  );
}
