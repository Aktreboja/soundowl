import { Card, Text, Image, SimpleGrid } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { SoundCloudTrack } from '@/types/soundcloud';

// Liked Tracks
export default function LikedTracks({
  likedTracks,
}: {
  likedTracks: SoundCloudTrack[];
}) {
  return (
    <Card.Root variant="elevated" className="card w-3/4 flex flex-col gap-4">
      <Text fontSize="2xl" fontWeight="bold">
        Liked Tracks
      </Text>
      <SimpleGrid columns={10} gap={2}>
        {likedTracks.map((track) => (
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
