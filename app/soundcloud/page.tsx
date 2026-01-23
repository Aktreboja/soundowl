'use client';
import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Button,
  Box,
  Card,
  Spinner,
  Stack,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { useSoundCloudAuth } from '@/hooks/useSoundCloudAuth';
import {
  useGetSoundCloudLikedTracksQuery,
  useGetSoundCloudProfileQuery,
  useGetSoundCloudActivitiesQuery,
} from '@/lib/store/soundcloudApi';
import { Tooltip } from '@/components/ui/tooltip';

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

  const {
    data: likedTracks = [],
    isLoading: likedTracksLoading,
    error: likedTracksError,
  } = useGetSoundCloudLikedTracksQuery(undefined, { skip: !isAuthenticated });

  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useGetSoundCloudActivitiesQuery(undefined, { skip: !isAuthenticated });

  console.log('Liked Tracks', likedTracks);
  console.log('Activities', activities);
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
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <Box
          className="flex flex-col items-center justify-center gap-6 p-8"
          bg={{ base: 'gray.50', _dark: 'gray.800' }}
          borderRadius="lg"
          boxShadow="lg"
          maxW="2xl"
          w="full"
        >
          <h1 className="text-3xl font-bold text-center">
            Welcome to SoundCloud
          </h1>

          <Stack direction="column" gap={4} align="stretch" w="full">
            <Stack direction="row" gap={4} justify="center" align="center">
              {profile.avatar_url && (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <Stack direction="column" align="start" gap={1}>
                <Text fontSize="xl" fontWeight="bold">
                  {profile.full_name || profile.username}
                </Text>
                {profile.username && (
                  <Text fontSize="sm" color="gray.500">
                    @{profile.username}
                  </Text>
                )}
              </Stack>
            </Stack>

            {profile.description && (
              <Text
                textAlign="center"
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                {profile.description}
              </Text>
            )}

            <Stack direction="row" gap={6} justify="center" wrap="wrap">
              <Stack direction="column" gap={1} align="center">
                <Text fontSize="2xl" fontWeight="bold">
                  {profile.followers_count.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Followers
                </Text>
              </Stack>
              <Stack direction="column" gap={1} align="center">
                <Text fontSize="2xl" fontWeight="bold">
                  {profile.track_count.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Tracks
                </Text>
              </Stack>
              <Stack direction="column" gap={1} align="center">
                <Text fontSize="2xl" fontWeight="bold">
                  {profile.playlist_count.toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Playlists
                </Text>
              </Stack>
            </Stack>

            {profile.permalink_url && (
              <a
                href={profile.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button colorPalette="blue" variant="outline" w="full">
                  View on SoundCloud
                </Button>
              </a>
            )}

            <Button onClick={handleLogout} colorPalette="red" variant="outline">
              Logout
            </Button>
          </Stack>
        </Box>

        <Card.Root
          variant="elevated"
          className="card w-3/4 flex flex-col gap-4"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Liked Tracks
          </Text>
          <SimpleGrid columns={10} gap={2}>
            {likedTracks.map((track) => (
              <Tooltip content={track.title} key={track.id} showArrow>
                <div
                  key={track.id}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Image
                    src={track.artwork_url || ''}
                    alt={track.title}
                    width={100}
                    height={100}
                  />
                </div>
              </Tooltip>
            ))}
          </SimpleGrid>
        </Card.Root>

        {/* Activity feed section */}
        <Card.Root
          variant="elevated"
          className="card w-3/4 flex flex-col gap-4"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Activities
          </Text>
          <SimpleGrid columns={10} gap={2}>
            {activities?.collection.map((activity) => (
              <Tooltip
                content={activity.origin.title || ''}
                key={activity.origin.id}
                showArrow
              >
                <div
                  key={activity.origin.id}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Image
                    src={activity.origin.artwork_url || ''}
                    alt={activity.origin.title || ''}
                    width={100}
                    height={100}
                  />
                </div>
              </Tooltip>
            ))}
          </SimpleGrid>
        </Card.Root>
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
