'use client';
import { useEffect, useState, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';

const timeRangeItems = [
  { value: 'short_term', label: 'Last Week' },
  { value: 'medium_term', label: 'Last Month' },
  { value: 'long_term', label: 'All Time' },
];

export const TopArtistsContent = () => {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [timeRange, setTimeRange] = useState<string>('short_term');
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null
  );
  const collection = useMemo(
    () => createListCollection({ items: timeRangeItems }),
    []
  );

  const fetchTopArtists = async (timeRange: string) => {
    try {
      const response = await fetch(
        `/api/spotify/v1/user/top?time_range=${timeRange}&limit=20&offset=0&type=artists`
      );
      const data = await response.json();
      setTopArtists(data.items);
    } catch (error) {
      console.error('Error fetching top artists:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTopArtists(timeRange);
    };
    fetchData();
  }, [timeRange]);

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
          onValueChange={(value) => setTimeRange(value.value[0])}
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

        {/* {selectedArtist && <ArtistDialog selectedArtist={selectedArtist} />} */}
      </DialogRoot>
    </Card.Root>
  );
};

export default TopArtistsContent;
