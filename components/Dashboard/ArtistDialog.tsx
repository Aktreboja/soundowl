'use client';
import { SpotifyArtist } from '@/types';
import { CloseButton, Dialog, Portal, Spinner } from '@chakra-ui/react';
import Image from 'next/image';
import { Tooltip } from '../ui/tooltip';
import {
  useGetArtistQuery,
  useGetArtistTopTracksQuery,
  useGetArtistAlbumsQuery,
} from '@/lib/store/spotifyApi';

export const ArtistDialog = ({
  selectedArtist,
}: {
  selectedArtist: SpotifyArtist | null;
}) => {
  const artistId = selectedArtist?.id ?? '';

  const { data: artistDetails, isLoading: isLoadingArtist } = useGetArtistQuery(
    artistId,
    { skip: !artistId }
  );

  const { data: topTracksData, isLoading: isLoadingTopTracks } =
    useGetArtistTopTracksQuery(artistId, { skip: !artistId });

  const { data: albumsData, isLoading: isLoadingAlbums } =
    useGetArtistAlbumsQuery(artistId, { skip: !artistId });

  const topTracks = topTracksData?.tracks ?? [];
  const albums = albumsData?.items ?? [];
  const isLoading = isLoadingArtist || isLoadingTopTracks || isLoadingAlbums;

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Image
              src={selectedArtist?.images[0]?.url || ''}
              alt={selectedArtist?.name || ''}
              width={100}
              height={100}
              className="rounded-full aspect-square object-cover"
            />
            <div className="flex flex-col justify-center">
              <Dialog.Title>{selectedArtist?.name}</Dialog.Title>
              {artistDetails?.followers && (
                <Dialog.Title className="text-sm! text-gray-300">
                  {formatFollowers(artistDetails.followers.total)} followers
                </Dialog.Title>
              )}
            </div>
          </Dialog.Header>
          <Dialog.Body>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {artistDetails?.genres && artistDetails.genres.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg! font-bold!">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {artistDetails.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm capitalize"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {artistDetails?.popularity !== undefined && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg! font-bold!">Popularity</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${artistDetails.popularity}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">
                        {artistDetails.popularity}%
                      </span>
                    </div>
                  </div>
                )}

                {topTracks.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-lg! font-bold! mb-4">Top Tracks</h3>
                    <div className="flex flex-wrap gap-4">
                      {topTracks.map((track) => (
                        <Tooltip content={track.name} key={track.id} showArrow>
                          <div
                            key={track.id}
                            className="cursor-pointer hover:opacity-80"
                          >
                            <Image
                              src={track.album.images[0].url}
                              alt={track.name}
                              width={64}
                              height={64}
                              className="rounded-full aspect-square object-cover"
                            />
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}
                {albums.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-lg! font-bold! mb-4">Albums</h3>
                    <div className="flex flex-wrap gap-4">
                      {albums.map((album) => (
                        <Tooltip content={album.name} key={album.id} showArrow>
                          <div
                            key={album.id}
                            className="cursor-pointer hover:opacity-80"
                          >
                            <Image
                              src={album.images[0].url}
                              alt={album.name}
                              width={64}
                              height={64}
                              className="rounded-full aspect-square object-cover"
                            />
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}
                {artistDetails?.external_urls?.spotify && (
                  <div className="mt-2 flex justify-end">
                    <a
                      href={artistDetails.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400 text-sm"
                    >
                      Open in Spotify →
                    </a>
                  </div>
                )}
              </div>
            )}
          </Dialog.Body>

          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
};

export default ArtistDialog;
