import { useGetNewReleasesQuery } from '@/lib/store/spotifyApi';
import { useState, useEffect } from 'react';
import { SpotifyAlbum } from '@/types';
import { Box, Card, Skeleton } from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';

export default function NewReleasesContent() {
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);
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
        <div className="grid max-md:grid-cols-5 grid-cols-10">
          {newReleases.length > 0 &&
            newReleases.map((album) => (
              <Tooltip content={album.name} key={album.id} showArrow>
                <Box key={album.id} className="cursor-pointer hover:opacity-80">
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
      )}
    </Card.Root>
  );
}
