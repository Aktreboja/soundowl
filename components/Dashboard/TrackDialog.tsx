'use client';
import { SpotifyArtist, SpotifyTrack } from '@/types';
import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';
import { useEffect, useState } from 'react';

export const TrackDialog = ({
  selectedTrack,
}: {
  selectedTrack: SpotifyTrack | null;
}) => {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  useEffect(() => {
    const fetchArtists = async () => {
      const response = await fetch(
        `/api/spotify/v1/artists?artist_ids=${selectedTrack?.artists
          .map((artist) => artist.id)
          .join(',')}`
      );
      const data = await response.json();
      setArtists(data.artists);
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
            <div className="flex flex-col gap-2">
              <h3 className="text-lg! font-bold!">Artists</h3>
              <div className="flex gap-4">
                {artists.length > 0 &&
                  artists.map((artist) => (
                    <div
                      key={artist.id}
                      className="cursor-pointer hover:opacity-80"
                    >
                      <Tooltip content={artist.name} showArrow>
                        <Image
                          src={artist.images[0].url}
                          alt={artist.name}
                          width={50}
                          height={50}
                          className="rounded-full w-16 h-16"
                        />
                      </Tooltip>
                    </div>
                  ))}
              </div>
            </div>
          </Dialog.Body>

          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
};

export default TrackDialog;
