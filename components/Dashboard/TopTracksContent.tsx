'use client';
import { useState, useMemo } from 'react';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '@/types/spotify';
import Image from 'next/image';
import { DialogRoot } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { DashboardCarouselCard } from '../ui/DashboardCarouselCard';
import { TrackDialog } from './TrackDialog';
import { ArtistDialog } from './ArtistDialog';
import { AlbumDialog } from './AlbumDialog';
import { useGetTopTracksQuery } from '@/lib/store/spotifyApi';
import { createListCollection } from '@chakra-ui/react';
import { timeRangeItems, type TimeRange } from './constants';

export const TopTracksContent = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null
  );
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbum | null>(null);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const collection = useMemo(
    () => createListCollection({ items: timeRangeItems }),
    []
  );

  const {
    data,
    isFetching: isFetchingTopTracks,
    isError,
  } = useGetTopTracksQuery({
    timeRange,
    limit: 20,
    offset: 0,
  });

  const topTracks = data?.items ?? [];

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

  const handleAlbumClick = (album: SpotifyAlbum) => {
    setArtistDialogOpen(false);
    setTrackDialogOpen(false);
    setSelectedAlbum(album);
    setAlbumDialogOpen(true);
  };

  return (
    <>
      <DashboardCarouselCard<SpotifyTrack>
        title="Your Top Tracks"
        select={{
          collection,
          value: timeRange,
          onValueChange: (v) => setTimeRange(v as TimeRange),
        }}
        isLoading={isFetchingTopTracks}
        isError={isError}
        errorMessage="Failed to load top tracks. Please try again."
        items={topTracks}
        itemsPerSlide={7}
        renderSlide={(tracks) => (
          <div className="flex gap-4 flex-row w-full">
            {tracks.map((track) => (
              <Tooltip content={track.name} key={track.id} showArrow>
                <div
                  className="cursor-pointer hover:opacity-80 flex-1"
                  onClick={() => handleTrackClick(track)}
                >
                  <Image
                    src={track.album.images[0].url}
                    alt={track.name}
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

export default TopTracksContent;
