'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { DialogRoot } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { DashboardCarouselCard } from '../ui/DashboardCarouselCard';
import { TrackDialog } from '../Dashboard/TrackDialog';
import { useGetSoundCloudActivitiesQuery } from '@/lib/store/soundcloudApi';
import { SoundCloudActivity, SoundCloudTrack } from '@/types/soundcloud';

export default function ActivityFeedContent() {
  const [selectedTrack, setSelectedTrack] = useState<SoundCloudTrack | null>(
    null
  );
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);

  const {
    data: activitiesData,
    isFetching: isLoading,
    isError,
  } = useGetSoundCloudActivitiesQuery();

  const uniqueActivities = useMemo(() => {
    const collection = activitiesData?.collection ?? [];
    const seen = new Map<number, SoundCloudActivity>();
    for (const activity of collection) {
      if (!seen.has(activity.origin.id)) {
        seen.set(activity.origin.id, activity);
      }
    }
    return Array.from(seen.values());
  }, [activitiesData]);

  const handleTrackClick = (track: SoundCloudTrack) => {
    setSelectedTrack(track);
    setTrackDialogOpen(true);
  };

  return (
    <>
      <DashboardCarouselCard<SoundCloudActivity>
        title="Activity Feed"
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load activity feed. Please try again."
        items={uniqueActivities}
        itemsPerSlide={7}
        renderSlide={(activities) => (
          <div className="flex gap-4 flex-row w-full">
            {activities.map((activity) => (
              <Tooltip
                content={activity.origin.title || ''}
                key={activity.origin.id}
                showArrow
              >
                <div
                  className="cursor-pointer hover:opacity-80 flex-1 aspect-square overflow-hidden"
                  onClick={() => handleTrackClick(activity.origin)}
                >
                  <Image
                    src={activity.origin.artwork_url || ''}
                    alt={activity.origin.title || ''}
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
            selectedTrack
              ? { service: 'soundcloud', track: selectedTrack }
              : null
          }
        />
      </DialogRoot>
    </>
  );
}
