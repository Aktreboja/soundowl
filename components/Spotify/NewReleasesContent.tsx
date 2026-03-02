'use client';
import { useGetNewReleasesQuery } from '@/lib/store/spotifyApi';
import { useState } from 'react';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify';
import { Box, Card, Skeleton, DialogRoot, Marquee } from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';
import { AlbumDialog } from '../Dashboard/AlbumDialog';
import { ArtistDialog } from '../Dashboard/ArtistDialog';
import { TrackDialog } from '../Dashboard/TrackDialog';

export default function NewReleasesContent() {
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null
  );
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const {
    data,
    isFetching: isFetchingNewReleases,
    isError,
  } = useGetNewReleasesQuery(undefined, { refetchOnFocus: true });
  const speed = 40;

  const newReleases = data?.albums?.items ?? [];

  const handleAlbumClick = (album: SpotifyAlbum) => {
    setArtistDialogOpen(false);
    setTrackDialogOpen(false);
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };

  const handleArtistClick = (artist: SpotifyArtist) => {
    setTrackDialogOpen(false);
    setAlbumDialogOpen(false);
    setSelectedArtist(artist);
    setArtistDialogOpen(true);
  };

  const handleTrackClick = (track: SpotifyTrack) => {
    setArtistDialogOpen(false);
    setAlbumDialogOpen(false);
    setSelectedTrack(track);
    setTrackDialogOpen(true);
  };

  return (
    <Card.Root
      variant="elevated"
      className="p-4 w-full flex flex-col gap-4"
      bg={{ base: 'white', _dark: 'gray.800' }}
    >
      <h1 className="text-lg font-bold">New from artists you follow</h1>
      {isFetchingNewReleases && (
        <div className="flex gap-4 flex-row w-full">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square w-full h-full flex-1"
              borderRadius="md"
              bg={{ base: 'gray.200', _dark: 'gray.700' }}
              style={{
                animationDelay: `${index * 60}ms`,
                animationDuration: '1.2s',
                animationFillMode: 'both',
              }}
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-4 text-red-600 dark:text-red-400">
          Failed to load new releases. Please try again.
        </div>
      )}

      {!isFetchingNewReleases && !isError && (
        <>
          <Marquee.Root speed={speed} pauseOnInteraction>
            <Marquee.Viewport>
              <Marquee.Content>
                {newReleases.length > 0 &&
                  newReleases.map((album) => (
                    <Marquee.Item key={album.id}>
                      <Tooltip content={album.name} showArrow>
                        <Box
                          key={album.id}
                          className="cursor-pointer max-md:max-w-24 max-md:max-h-24 max-w-56 max-h-56 hover:opacity-80"
                          onClick={() => handleAlbumClick(album)}
                        >
                          <Image
                            src={album.images[0].url}
                            alt={album.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </Box>
                      </Tooltip>
                    </Marquee.Item>
                  ))}
              </Marquee.Content>
            </Marquee.Viewport>
          </Marquee.Root>
          <DialogRoot
            size="lg"
            placement="center"
            open={albumDialogOpen}
            onOpenChange={(e) => setAlbumDialogOpen(e.open)}
          >
            {selectedAlbum && (
              <AlbumDialog
                selectedAlbum={selectedAlbum}
                onArtistClick={handleArtistClick}
                onTrackClick={handleTrackClick}
              />
            )}
          </DialogRoot>

          <DialogRoot
            size="lg"
            placement="center"
            open={artistDialogOpen}
            onOpenChange={(e) => setArtistDialogOpen(e.open)}
          >
            {selectedArtist && (
              <ArtistDialog
                selectedArtist={selectedArtist}
                onTrackClick={handleTrackClick}
                onAlbumClick={handleAlbumClick}
              />
            )}
          </DialogRoot>

          <DialogRoot
            size="lg"
            placement="center"
            open={trackDialogOpen}
            onOpenChange={(e) => setTrackDialogOpen(e.open)}
          >
            <TrackDialog
              trackData={
                selectedTrack
                  ? { service: 'spotify', track: selectedTrack }
                  : null
              }
              onArtistClick={handleArtistClick}
              onAlbumClick={handleAlbumClick}
            />
          </DialogRoot>
        </>
      )}
    </Card.Root>
  );
}
