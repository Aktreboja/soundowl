'use client';
import {
  SpotifyAlbum,
  SpotifyArtist,
  TrackDialogData,
  SoundCloudUser,
} from '@/types';
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Progress,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';
import { useGetMultipleArtistsQuery } from '@/lib/store/spotifyApi';

interface TrackDialogProps {
  trackData: TrackDialogData | null;
  onArtistClick?: (artist: SpotifyArtist) => void;
  onAlbumClick?: (album: SpotifyAlbum) => void;
  onUserClick?: (user: SoundCloudUser) => void;
}

export const TrackDialog = ({
  trackData,
  onArtistClick,
  onAlbumClick,
  onUserClick,
}: TrackDialogProps) => {
  // Only fetch Spotify artists when we have a Spotify track
  const artistIds =
    trackData?.service === 'spotify'
      ? trackData.track.artists.map((artist) => artist.id)
      : [];

  const {
    data,
    isFetching: isFetchingArtists,
    isError,
  } = useGetMultipleArtistsQuery(artistIds, {
    skip: artistIds.length === 0,
  });

  const artists = data?.artists ?? [];

  if (!trackData) return null;

  // Spotify Track Content
  if (trackData.service === 'spotify') {
    const track = trackData.track;
    return (
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Tooltip content="View Album" showArrow>
                <Image
                  src={track.album.images[0]?.url || ''}
                  alt={track.name}
                  width={100}
                  height={100}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => track.album && onAlbumClick?.(track.album)}
                />
              </Tooltip>
              <div className="flex flex-col justify-center">
                <Dialog.Title>{track.name}</Dialog.Title>
                <Dialog.Title
                  className="text-sm! cursor-pointer hover:underline"
                  onClick={() => track.album && onAlbumClick?.(track.album)}
                >
                  {track.album.name}
                </Dialog.Title>
                <Dialog.Title className="text-sm! text-gray-500">
                  {track.artists.map((artist) => artist.name).join(', ')}
                </Dialog.Title>
              </div>
            </Dialog.Header>
            <Dialog.Body>
              <div className="flex flex-col gap-2">
                {track.popularity && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg! font-bold!">Popularity</h3>
                    <Progress.Root
                      value={track.popularity}
                      colorPalette="green"
                      className="w-full flex gap-4"
                    >
                      <Progress.Track flex="1">
                        <Progress.Range />
                      </Progress.Track>
                      <Progress.ValueText>
                        {track.popularity}%
                      </Progress.ValueText>
                    </Progress.Root>
                  </div>
                )}
                <h3 className="text-lg! font-bold!">Artists</h3>
                {isFetchingArtists && (
                  <div className="flex justify-center py-4">
                    <Spinner size="md" />
                  </div>
                )}
                {isError && (
                  <div className="text-red-500 text-sm">
                    Failed to load artist details.
                  </div>
                )}
                {!isFetchingArtists && !isError && (
                  <div className="flex gap-4">
                    {artists.length > 0 &&
                      artists.map((artist) => (
                        <div
                          key={artist.id}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => onArtistClick?.(artist)}
                        >
                          <Tooltip content={artist.name} showArrow>
                            <Image
                              src={artist.images[0]?.url}
                              alt={artist.name}
                              width={50}
                              height={50}
                              className="rounded-full w-16 h-16"
                            />
                          </Tooltip>
                        </div>
                      ))}
                  </div>
                )}
                {track.external_urls.spotify && (
                  <div className="mt-2 flex justify-end">
                    <Button asChild colorPalette="green">
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Spotify →
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    );
  }

  // SoundCloud Track Content
  if (trackData.service === 'soundcloud') {
    const track = trackData.track;
    const user = track.user;

    // Format large numbers for display
    const formatCount = (count: number | null) => {
      if (count === null) return '0';
      if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
      if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
      return count.toString();
    };

    return (
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Image
                src={track.artwork_url || ''}
                alt={track.title}
                width={100}
                height={100}
                className="rounded"
              />
              <div className="flex flex-col justify-center">
                <Dialog.Title>{track.title}</Dialog.Title>
                <Dialog.Title
                  className={`text-sm! text-gray-500 ${onUserClick ? 'cursor-pointer hover:underline' : ''}`}
                  onClick={() => onUserClick?.(user)}
                >
                  {user.full_name || user.username}
                </Dialog.Title>
                {track.genre && (
                  <Text fontSize="xs" color="gray.400">
                    {track.genre}
                  </Text>
                )}
              </div>
            </Dialog.Header>
            <Dialog.Body>
              <div className="flex flex-col gap-4">
                {/* Engagement Stats */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg! font-bold!">Engagement</h3>
                  <Stack direction="row" gap={6} wrap="wrap">
                    <Stack direction="column" gap={0} align="center">
                      <Text fontSize="xl" fontWeight="bold">
                        {formatCount(track.playback_count)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Plays
                      </Text>
                    </Stack>
                    <Stack direction="column" gap={0} align="center">
                      <Text fontSize="xl" fontWeight="bold">
                        {formatCount(track.favoritings_count)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Likes
                      </Text>
                    </Stack>
                    <Stack direction="column" gap={0} align="center">
                      <Text fontSize="xl" fontWeight="bold">
                        {formatCount(track.reposts_count)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Reposts
                      </Text>
                    </Stack>
                    <Stack direction="column" gap={0} align="center">
                      <Text fontSize="xl" fontWeight="bold">
                        {formatCount(track.comment_count)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Comments
                      </Text>
                    </Stack>
                  </Stack>
                </div>

                {/* Artist Section */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg! font-bold!">Artist</h3>
                  <div
                    className={`flex items-center gap-3 ${onUserClick ? 'cursor-pointer hover:opacity-80' : ''}`}
                    onClick={() => onUserClick?.(user)}
                  >
                    {user.avatar_url && (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || user.username}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <Text fontWeight="medium">
                        {user.full_name || user.username}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        @{user.username}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Open in SoundCloud */}
                {track.permalink_url && (
                  <div className="mt-2 flex justify-end">
                    <Button asChild colorPalette="orange">
                      <a
                        href={track.permalink_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in SoundCloud →
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    );
  }

  return null;
};

export default TrackDialog;
