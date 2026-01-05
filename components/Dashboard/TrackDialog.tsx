'use client';
import { SpotifyTrack } from '@/types';
import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import Image from 'next/image';

import { useEffect } from 'react';

export const TrackDialog = ({
  selectedTrack,
}: {
  selectedTrack: SpotifyTrack | null;
}) => {
  useEffect(() => {
    const fetchArtists = async () => {
      const response = await fetch(
        `/api/spotify/v1/artists?artist_ids=${selectedTrack?.artists
          .map((artist) => artist.id)
          .join(',')}`
      );
      const data = await response.json();
      console.log(data);
    };
    fetchArtists();
  }, [selectedTrack]);
  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Image
              src={selectedTrack?.album.images[0].url || ''}
              alt={selectedTrack?.name || ''}
              width={100}
              height={100}
            />
            <div className="flex flex-col justify-center">
              <Dialog.Title>{selectedTrack?.name}</Dialog.Title>
              <Dialog.Title className="text-sm! text-gray-300">
                {selectedTrack?.album.name}
              </Dialog.Title>
              <Dialog.Title className="text-sm! text-gray-500">
                {selectedTrack?.artists.map((artist) => artist.name).join(', ')}
              </Dialog.Title>
            </div>
          </Dialog.Header>
          <Dialog.Body>
            <div>
              <h3>Artists</h3>
            </div>
          </Dialog.Body>
          {/* <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.ActionTrigger>
            <Button>Save</Button>
          </Dialog.Footer> */}
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
};

export default TrackDialog;
