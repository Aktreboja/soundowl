'use client';
import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Box, Spinner } from '@chakra-ui/react';
import { useSoundCloudAuth } from '@/hooks/useSoundCloudAuth';
import { useGetSoundCloudProfileQuery } from '@/lib/store/soundcloudApi';
import {
  LikedTracksContent,
  ActivityFeedContent,
} from '@/components/Soundcloud';

export default function SoundCloudPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useSoundCloudAuth();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetSoundCloudProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

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

  // Authenticated state
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
      <Box className="app-container w-full max-w-[1080px] flex flex-col h-full gap-4 justify-center items-center">
        <LikedTracksContent />
        <ActivityFeedContent />
      </Box>
    );
  }

  return null;
}
