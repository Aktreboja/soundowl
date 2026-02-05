'use client';
import { SoundCloudActivity } from '@/types/soundcloud';
import { Card, Text, SimpleGrid, Image } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { useMemo } from 'react';

export default function ActivityFeed({
  activities,
}: {
  activities: SoundCloudActivity[];
}) {
  let uniqueActivities = useMemo(() => {
    return activities.filter(
      (activity, index, self) =>
        index === self.findIndex((a) => a.origin.id === activity.origin.id)
    );
  }, [activities]);
  return (
    <Card.Root variant="elevated" className="card w-3/4 flex flex-col gap-4">
      <Text fontSize="2xl" fontWeight="bold">
        Activities
      </Text>
      <SimpleGrid columns={10} gap={2}>
        {uniqueActivities.map((activity) => (
          <Tooltip
            content={activity.origin.title || ''}
            key={activity.origin.id}
            showArrow
          >
            <div
              key={activity.origin.id}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Image
                src={activity.origin.artwork_url || ''}
                alt={activity.origin.title || ''}
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
