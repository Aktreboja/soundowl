import type { SoundCloudProfile } from '@/types/soundcloud';
import { Box, Stack, Text, Image, Button } from '@chakra-ui/react';
import router from 'next/router';
import UniversalSearch from '../Dashboard/UniversalSearch';

export default function SoundCloudProfile({
  profile,
}: {
  profile: SoundCloudProfile;
}) {
  return (
    <Box
      className="flex w-full flex-col items-center justify-center gap-6 p-6"
      bg={{ base: 'gray.50', _dark: 'gray.900' }}
      borderRadius="lg"
      boxShadow="lg"
    >
      <h1 className="text-3xl font-bold text-center">Welcome to SoundOwl</h1>

      <Stack direction="column" gap={4} align="stretch" w="full">
        <Stack direction="column" gap={4} justify="center" align="center">
          {profile.avatar_url && (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              width={24}
              height={24}
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

        {/* {profile.permalink_url && (
          <a
            href={profile.permalink_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button colorPalette="blue" variant="outline" w="full">
              View on SoundCloud
            </Button>
          </a>
        )} */}

        {/* <Button onClick={handleLogout} colorPalette="red" variant="outline">
          Logout
        </Button> */}
        <UniversalSearch />
      </Stack>
    </Box>
  );
}
