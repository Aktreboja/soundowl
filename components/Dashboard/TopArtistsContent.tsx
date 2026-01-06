'use client';
import { useState, useMemo } from 'react';
import { SpotifyArtist } from '@/types';
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
  DialogTrigger,
  Spinner,
} from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { ArtistDialog } from './ArtistDialog';
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
        <DialogRoot size="lg" placement="center">
          <div className="grid grid-cols-5">
            {topArtists.map((artist) => (
              <Tooltip content={artist.name} key={artist.id} showArrow>
                <DialogTrigger
                  asChild
                  key={artist.id}
                  onClick={() => setSelectedArtist(artist)}
                >
                  <div
                    key={artist.id}
                    className="cursor-pointer hover:opacity-80 aspect-square overflow-hidden"
                  >
                    <Image
                      src={artist.images[0].url}
                      alt={artist.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </DialogTrigger>
              </Tooltip>
            ))}
          </div>

          {selectedArtist && <ArtistDialog selectedArtist={selectedArtist} />}
        </DialogRoot>
      )}
    </Card.Root>
  );
};

export default TopArtistsContent;
