'use client';
import { useState, useMemo } from 'react';
import { SpotifyArtist, SpotifyTrack } from '@/types';
import Image from 'next/image';
import {
  SelectContent,
  SelectValueText,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from '../ui/select';
import {
  Card,
  createListCollection,
  DialogRoot,
  Spinner,
} from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { ArtistDialog } from './ArtistDialog';
import { TrackDialog } from './TrackDialog';
import { useGetTopArtistsQuery } from '@/lib/store/spotifyApi';

const timeRangeItems = [
  { value: 'short_term', label: 'Last Week' },
  { value: 'medium_term', label: 'Last Month' },
  { value: 'long_term', label: 'All Time' },
];

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export const TopArtistsContent = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null
  );
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const collection = useMemo(
    () => createListCollection({ items: timeRangeItems }),
    []
  );

  const { data, isLoading, isError } = useGetTopArtistsQuery({
    timeRange,
    limit: 20,
    offset: 0,
  });

  const topArtists = data?.items ?? [];

  const handleTrackClick = (track: SpotifyTrack) => {
    setArtistDialogOpen(false);
    setSelectedTrack(track);
    setTrackDialogOpen(true);
  };

  const handleArtistClick = (artist: SpotifyArtist) => {
    setTrackDialogOpen(false);
    setSelectedArtist(artist);
    setArtistDialogOpen(true);
  };

  return (
    <Card.Root
      variant="elevated"
      className="card w-full flex flex-col gap-4"
      bg={{ base: 'white', _dark: 'gray.800' }}
    >
      <h2 className="font-bold text-lg mb-2">Your Top Artists</h2>
      <div>
        <SelectRoot
          collection={collection}
          size="sm"
          variant="subtle"
          defaultValue={[timeRange]}
          onValueChange={(value) => setTimeRange(value.value[0] as TimeRange)}
        >
          <SelectTrigger>
            <SelectValueText />
          </SelectTrigger>
          <SelectContent>
            {collection.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="text-red-500 text-center py-4">
          Failed to load top artists. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-5">
            {topArtists.map((artist) => (
              <Tooltip content={artist.name} key={artist.id} showArrow>
                <div
                  className="cursor-pointer hover:opacity-80 aspect-square overflow-hidden"
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
              />
            )}
          </DialogRoot>
        </>
      )}
    </Card.Root>
  );
};

export default TopArtistsContent;
