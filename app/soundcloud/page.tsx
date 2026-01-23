'use client';
import { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Box, Spinner, Stack, Text } from '@chakra-ui/react';
import { useSoundCloudAuth } from '@/hooks/useSoundCloudAuth';
import { useGetSoundCloudProfileQuery } from '@/lib/store/soundcloudApi';

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
      <div className="w-full min-h-screen flex items-center justify-center">
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
