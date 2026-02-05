import { Card, Text, Image, SimpleGrid } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { SoundCloudTrack } from '@/types/soundcloud';
import { useMemo } from 'react';

// Liked Tracks
export default function LikedTracks({
  likedTracks,
}: {
  likedTracks: SoundCloudTrack[];
}) {
  let uniqueLikedTracks = useMemo(() => {
    return likedTracks.filter(
      (track, index, self) => index === self.findIndex((t) => t.id === track.id)
    );
  }, [likedTracks]);

  return (
    <Card.Root variant="elevated" className="card w-3/4 flex flex-col gap-4">
      <Text fontSize="2xl" fontWeight="bold">
        Liked Tracks
      </Text>
      <SimpleGrid columns={10} gap={2}>
        {uniqueLikedTracks.map((track) => (
          <Tooltip content={track.title} key={track.id} showArrow>
            <div
              key={track.id}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Image
                src={track.artwork_url || ''}
                alt={track.title}
                width={100}
                height={100}
              />
            </div>
          </Tooltip>
        ))}
      </SimpleGrid>
    </Card.Root>
  );
}
