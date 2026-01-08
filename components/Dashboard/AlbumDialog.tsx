'use client';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types';
import {
  Badge,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Progress,
  Spinner,
  Table,
} from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';
import {
  useGetAlbumQuery,
  useGetMultipleArtistsQuery,
  SimplifiedTrack,
} from '@/lib/store/spotifyApi';

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatReleaseDate = (date: string, precision: string) => {
  if (precision === 'year') return date;
  if (precision === 'month') {
    const [year, month] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      'en-US',
      { year: 'numeric', month: 'long' }
    );
  }
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const AlbumDialog = ({
  selectedAlbum,
  onArtistClick,
  onTrackClick,
}: {
  selectedAlbum: SpotifyAlbum | null;
  onArtistClick?: (artist: SpotifyArtist) => void;
  onTrackClick?: (track: SpotifyTrack) => void;
}) => {
  const albumId = selectedAlbum?.id ?? '';

  const { data: albumDetails, isFetching: isFetchingAlbum } = useGetAlbumQuery(
    albumId,
    { skip: !albumId }
  );

  const artistIds = selectedAlbum?.artists.map((artist) => artist.id) ?? [];
  const { data: artistsData, isFetching: isFetchingArtists } =
    useGetMultipleArtistsQuery(artistIds, {
      skip: artistIds.length === 0,
    });

  const artists = artistsData?.artists ?? [];
  const tracks = albumDetails?.tracks?.items ?? [];
  const isLoading = isFetchingAlbum || isFetchingArtists;

  // Convert SimplifiedTrack to SpotifyTrack for the dialog
  const handleTrackClick = (track: SimplifiedTrack) => {
    if (!selectedAlbum || !onTrackClick) return;

    // Create a SpotifyTrack from SimplifiedTrack by adding album info
    const fullTrack: SpotifyTrack = {
      ...track,
      album: selectedAlbum,
      popularity: 0,
      external_ids: { isrc: '' },
      available_markets: track.available_markets,
      is_playable: true,
    };
    onTrackClick(fullTrack);
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Image
              src={selectedAlbum?.images[0]?.url || ''}
              alt={selectedAlbum?.name || ''}
              width={100}
              height={100}
              className="rounded aspect-square object-cover"
            />
            <div className="flex flex-col justify-center">
              <Dialog.Title>{selectedAlbum?.name}</Dialog.Title>
              <Dialog.Title className="text-sm! text-gray-500">
                {selectedAlbum?.artists.map((artist) => artist.name).join(', ')}
              </Dialog.Title>
              <div className="flex gap-2 mt-1">
                <Badge
                  colorPalette="purple"
                  className="px-2 py-0.5 rounded text-xs capitalize"
                >
                  {selectedAlbum?.album_type}
                </Badge>
                {selectedAlbum?.release_date && (
                  <span className="text-xs text-gray-400">
                    {formatReleaseDate(
                      selectedAlbum.release_date,
                      selectedAlbum.release_date_precision
                    )}
                  </span>
                )}
              </div>
            </div>
          </Dialog.Header>
          <Dialog.Body>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Popularity */}
                {albumDetails?.popularity !== undefined && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg! font-bold!">Popularity</h3>
                    <Progress.Root
                      value={albumDetails.popularity}
                      colorPalette="purple"
                      className="w-full flex gap-4"
                    >
                      <Progress.Track flex="1">
                        <Progress.Range />
                      </Progress.Track>
                      <Progress.ValueText>
                        {albumDetails.popularity}%
                      </Progress.ValueText>
                    </Progress.Root>
                  </div>
                )}

                {/* Album Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {albumDetails?.total_tracks && (
                    <span>{albumDetails.total_tracks} tracks</span>
                  )}
                  {albumDetails?.label && <span>• {albumDetails.label}</span>}
                </div>

                {/* Artists */}
                {artists.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg! font-bold!">Artists</h3>
                    <div className="flex gap-4">
                      {artists.map((artist) => (
                        <div
                          key={artist.id}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => onArtistClick?.(artist)}
                        >
                          <Tooltip content={artist.name} showArrow>
                            <Image
                              src={artist.images?.[0]?.url || ''}
                              alt={artist.name}
                              width={50}
                              height={50}
                              className="rounded-full w-16 h-16 object-cover"
                            />
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tracks */}
                {tracks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg! font-bold!">Tracks</h3>
                    <div className="max-h-64 overflow-y-auto">
                      <Table.Root size="sm" variant="line">
                        <Table.Body>
                          {tracks.map((track) => (
                            <Table.Row
                              key={track.id}
                              className="cursor-pointer hover:bg-gray-700/30 transition-colors"
                              onClick={() => handleTrackClick(track)}
                            >
                              <Table.Cell className="w-8 text-gray-500">
                                {track.track_number}
                              </Table.Cell>
                              <Table.Cell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {track.name}
                                  </span>
                                  {track.explicit && (
                                    <Badge
                                      size="sm"
                                      colorPalette="gray"
                                      className="w-fit text-xs"
                                    >
                                      E
                                    </Badge>
                                  )}
                                </div>
                              </Table.Cell>
                              <Table.Cell className="text-right text-gray-400">
                                {formatDuration(track.duration_ms)}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </div>
                  </div>
                )}

                {/* Copyrights */}
                {albumDetails?.copyrights &&
                  albumDetails.copyrights.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      {albumDetails.copyrights.map((copyright, index) => (
                        <p key={index}>{copyright.text}</p>
                      ))}
                    </div>
                  )}

                {/* Spotify Link */}
                {selectedAlbum?.external_urls?.spotify && (
                  <div className="mt-2 flex justify-end">
                    <Button asChild colorPalette="purple">
                      <a
                        href={selectedAlbum.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Spotify →
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Dialog.Body>

          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
};

export default AlbumDialog;
