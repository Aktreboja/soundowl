'use client';
import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Box, Grid, GridItem, Spinner } from '@chakra-ui/react';
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
import { SoundCloudActivity, SoundCloudTrack } from '@/types/soundcloud';

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

  // Track dialog state
  const [selectedTrack, setSelectedTrack] = useState<SoundCloudTrack | null>(
    null
  );
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);

  const handleTrackClick = (track: SoundCloudTrack) => {
    setSelectedTrack(track);
    setTrackDialogOpen(true);
  };

  const uniqueActivities = useMemo(() => {
    if (!activities?.collection) return [];
    const seen = new Map<number, SoundCloudActivity>();
    for (const activity of activities.collection) {
      if (!seen.has(activity.origin.id)) {
        seen.set(activity.origin.id, activity);
      }
    }
    return Array.from(seen.values());
  }, [activities]);

  const error = useMemo(() => {
    const errorParam = searchParams.get('error');
    return errorParam ? `Authentication error: ${errorParam}` : null;
  }, [searchParams]);

  const handleGetStarted = () => {
    router.push('/api/soundcloud/auth');
  };

  const handleLogout = () => {
    // Clear SoundCloud cookies by calling logout endpoint
    router.push('/api/soundcloud/logout');
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
      <div className="w-full max-w-[1920px] mx-auto min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        {/* Activity feed section */}
        <Grid className="w-full grid-cols-2 grid max-xl:grid-cols-1" gap={4}>
          <GridItem>
            {' '}
            <SoundCloudProfile profile={profile} />
          </GridItem>
        </Grid>

        <h1 className="text-start text-2xl font-semibold w-full">
          Soundloud Activity Feed
        </h1>
        <Grid className="grid-cols-2 grid max-xl:grid-cols-1" gap={4}>
          <GridItem>
            <LikedTracks likedTracks={likedTracks} />
          </GridItem>
          <GridItem>
            <ActivityFeed activities={activities?.collection || []} />
          </GridItem>
        </Grid>
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
