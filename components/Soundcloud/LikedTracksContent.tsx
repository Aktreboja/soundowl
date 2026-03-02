'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { DialogRoot } from '@chakra-ui/react';
import { Tooltip } from '../ui/tooltip';
import { DashboardCarouselCard } from '../ui/DashboardCarouselCard';
import { TrackDialog } from '../Dashboard/TrackDialog';
import { useGetSoundCloudLikedTracksQuery } from '@/lib/store/soundcloudApi';
import { SoundCloudTrack } from '@/types/soundcloud';

export default function LikedTracksContent() {
  const [selectedTrack, setSelectedTrack] = useState<SoundCloudTrack | null>(
    null
  );
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);

  const {
    data: likedTracks = [],
    isFetching: isLoading,
    isError,
  } = useGetSoundCloudLikedTracksQuery();

  const uniqueTracks = useMemo(() => {
    return likedTracks.filter(
      (track, index, self) => index === self.findIndex((t) => t.id === track.id)
    );
  }, [likedTracks]);

  const handleTrackClick = (track: SoundCloudTrack) => {
    setSelectedTrack(track);
    setTrackDialogOpen(true);
  };

  return (
    <>
      <DashboardCarouselCard<SoundCloudTrack>
        title="Liked Tracks"
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load liked tracks. Please try again."
        items={uniqueTracks}
        itemsPerSlide={7}
        renderSlide={(tracks) => (
          <div className="flex gap-4 flex-row w-full">
            {tracks.map((track) => (
              <Tooltip content={track.title} key={track.id} showArrow>
                <div
                  className="cursor-pointer hover:opacity-80 flex-1 aspect-square overflow-hidden"
                  onClick={() => handleTrackClick(track)}
                >
                  <Image
                    src={track.artwork_url || ''}
                    alt={track.title}
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
