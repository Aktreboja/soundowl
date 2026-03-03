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
      className="flex w-full flex-col items-center justify-center gap-6 p-6 bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm rounded-xl"
    >
      <h1 className="text-3xl font-bold text-center text-slate-100">Welcome to SoundOwl</h1>

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
            <Text fontSize="xl" fontWeight="bold" className="text-slate-100">
              {profile.full_name || profile.username}
            </Text>
            {profile.username && (
            <Text fontSize="sm" className="text-slate-400">
              @{profile.username}
            </Text>
            )}
          </Stack>
        </Stack>

        {profile.description && (
          <Text textAlign="center" className="text-slate-400">
            {profile.description}
          </Text>
        )}

        <Stack direction="row" gap={6} justify="center" wrap="wrap">
          <Stack direction="column" gap={1} align="center">
            <Text fontSize="2xl" fontWeight="bold" className="text-slate-100">
              {profile.followers_count.toLocaleString()}
            </Text>
            <Text fontSize="sm" className="text-slate-400">
              Followers
            </Text>
          </Stack>
          <Stack direction="column" gap={1} align="center">
            <Text fontSize="2xl" fontWeight="bold" className="text-slate-100">
              {profile.track_count.toLocaleString()}
            </Text>
            <Text fontSize="sm" className="text-slate-400">
              Tracks
            </Text>
          </Stack>
          <Stack direction="column" gap={1} align="center">
            <Text fontSize="2xl" fontWeight="bold" className="text-slate-100">
              {profile.playlist_count.toLocaleString()}
            </Text>
            <Text fontSize="sm" className="text-slate-400">
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
