'use client';
import { useState, useMemo } from 'react';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify';
import Image from 'next/image';
import { DialogRoot } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { DashboardCarouselCard } from '../ui/DashboardCarouselCard';
import { ArtistDialog } from './ArtistDialog';
import { TrackDialog } from './TrackDialog';
import { AlbumDialog } from './AlbumDialog';
import { useGetTopArtistsQuery } from '@/lib/store/spotifyApi';
import { createListCollection } from '@chakra-ui/react';
import { timeRangeItems, type TimeRange } from './constants';

export const TopArtistsContent = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null
  );
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const collection = useMemo(
    () => createListCollection({ items: timeRangeItems }),
    []
  );

  const {
    data,
    isFetching: isFetchingTopArtists,
    isError,
  } = useGetTopArtistsQuery({
    timeRange,
    limit: 20,
    offset: 0,
  });

  const topArtists = data?.items ?? [];

  const handleTrackClick = (track: SpotifyTrack) => {
    setArtistDialogOpen(false);
    setAlbumDialogOpen(false);
    setSelectedTrack(track);
    setTrackDialogOpen(true);
  };

  const handleArtistClick = (artist: SpotifyArtist) => {
    setTrackDialogOpen(false);
    setAlbumDialogOpen(false);
    setSelectedArtist(artist);
    setArtistDialogOpen(true);
  };

  const handleAlbumClick = (album: SpotifyAlbum) => {
    setArtistDialogOpen(false);
    setTrackDialogOpen(false);
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };

  return (
    <>
      <DashboardCarouselCard<SpotifyArtist>
        title="Your Top Artists"
        select={{
          collection,
          value: timeRange,
          onValueChange: (v) => setTimeRange(v as TimeRange),
        }}
        isLoading={isFetchingTopArtists}
        isError={isError}
        errorMessage="Failed to load top artists. Please try again."
        items={topArtists}
        itemsPerSlide={7}
        renderSlide={(artists) => (
          <div className="flex gap-4 flex-row w-full">
            {artists.map((artist) => (
              <Tooltip content={artist.name} key={artist.id} showArrow>
                <div
                  className="cursor-pointer hover:opacity-80 flex-1 aspect-square overflow-hidden"
                  onClick={() => handleArtistClick(artist)}
                >
                  <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        )}
      />

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
            selectedTrack ? { service: 'spotify', track: selectedTrack } : null
          }
          onArtistClick={handleArtistClick}
          onAlbumClick={handleAlbumClick}
        />
      </DialogRoot>

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
    </>
  );
};

export default TopArtistsContent;
