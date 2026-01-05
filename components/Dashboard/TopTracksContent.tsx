'use client';
import { useEffect, useState, useMemo } from 'react';
import { SpotifyTrack } from '@/types';
import Image from 'next/image';
import {
  SelectContent,
  SelectValueText,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from '../ui/select';
import { createListCollection, DialogRoot } from '@chakra-ui/react';
import { DialogTrigger } from '@chakra-ui/react';

import { TrackDialog } from './TrackDialog';

const timeRangeItems = [
  { value: 'short_term', label: 'Last Week' },
  { value: 'medium_term', label: 'Last Month' },
  { value: 'long_term', label: 'All Time' },
];

export const TopTracksContent = () => {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [timeRange, setTimeRange] = useState<string>('short_term');
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const collection = useMemo(
    () => createListCollection({ items: timeRangeItems }),
    []
  );

  const fetchTopTracks = async (timeRange: string) => {
    try {
      const response = await fetch(
        `/api/spotify/v1/user/top?time_range=${timeRange}&limit=20&offset=0`
      );
      const data = await response.json();
      setTopTracks(data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTopTracks(timeRange);
    };
    fetchData();
  }, [timeRange]);

  return (
    <div className="card bg-gray-700 w-full flex flex-col gap-4">
      <h2 className="font-bold mb-2">Your Top Tracks</h2>
      <div>
        <SelectRoot
          collection={collection}
          size="sm"
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
        <div className="grid grid-cols-10 max-md:grid-cols-5">
          {topTracks.map((track) => (
            <DialogTrigger
              asChild
              key={track.id}
              onClick={() => setSelectedTrack(track)}
            >
              <div
                key={track.id}
                title={track.name}
                className="cursor-pointer hover:opacity-80"
              >
                <Image
                  src={track.album.images[0].url}
                  alt={track.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            </DialogTrigger>
          ))}
        </div>

        <TrackDialog selectedTrack={selectedTrack} />
      </DialogRoot>
    </div>
  );
};

export default TopTracksContent;
