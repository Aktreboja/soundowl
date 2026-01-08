'use client';
import { useGetNewReleasesQuery } from '@/lib/store/spotifyApi';
import { useState, useEffect } from 'react';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types';
import { Box, Card, Skeleton, DialogRoot } from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';
import { AlbumDialog } from './AlbumDialog';
import { ArtistDialog } from './ArtistDialog';
import { TrackDialog } from './TrackDialog';

export default function NewReleasesContent() {
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
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
  } = useGetNewReleasesQuery();
  useEffect(() => {
    const fetchNewReleases = async () => {
      if (data) {
        console.log('OG DATA', data);
        console.log(data.albums);
        setNewReleases(data.albums.items);
      }
    };
    fetchNewReleases();
  }, [data]);

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
      className="card w-full flex flex-col gap-4"
      bg={{ base: 'white', _dark: 'gray.800' }}
    >
      <h1 className="text-lg font-bold">New Releases</h1>

      {isFetchingNewReleases && (
        <div className="grid max-md:grid-cols-5 grid-cols-10">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square w-full rounded-none"
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
        <div className="text-red-500 text-center py-4">
          Failed to load new releases. Please try again.
        </div>
      )}

      {!isFetchingNewReleases && !isError && (
        <>
          <div className="grid max-md:grid-cols-5 grid-cols-10">
            {newReleases.length > 0 &&
              newReleases.map((album) => (
                <Tooltip content={album.name} key={album.id} showArrow>
                  <Box
                    key={album.id}
                    className="cursor-pointer hover:opacity-80"
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
              ))}
          </div>

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
            {selectedTrack && (
              <TrackDialog
                selectedTrack={selectedTrack}
                onArtistClick={handleArtistClick}
                onAlbumClick={handleAlbumClick}
              />
            )}
          </DialogRoot>
        </>
      )}
    </Card.Root>
  );
}
