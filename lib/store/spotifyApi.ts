import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  SpotifyArtist,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyProfile,
} from '@/types';

// Extended artist with additional details
export interface ArtistDetails extends SpotifyArtist {
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
}

// Response types
interface TopItemsResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

interface ArtistTopTracksResponse {
  tracks: SpotifyTrack[];
}

interface ArtistAlbumsResponse {
  items: SpotifyAlbum[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

interface MultipleArtistsResponse {
  artists: SpotifyArtist[];
}

// Extended album with full details
export interface AlbumDetails extends SpotifyAlbum {
  genres: string[];
  label: string;
  popularity: number;
  copyrights: Array<{
    text: string;
    type: string;
  }>;
  tracks: {
    items: SimplifiedTrack[];
    total: number;
    limit: number;
    offset: number;
    href: string;
    next: string | null;
    previous: string | null;
  };
}

// Simplified track (from album tracks endpoint)
export interface SimplifiedTrack {
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: string;
}

interface AlbumTracksResponse {
  items: SimplifiedTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

interface AuthStatusResponse {
  authenticated: boolean;
}

// Query argument types
interface TopItemsParams {
  type: 'artists' | 'tracks';
  timeRange?: 'short_term' | 'medium_term' | 'long_term';
  limit?: number;
  offset?: number;
}

interface AlbumResponseMetadata {
  href: string;
  limit: number;
  next: string | null;
  previous: string | null;
  total: number;
  items: SpotifyAlbum[];
}

interface NewReleasesResponse {
  albums: AlbumResponseMetadata;
}

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/spotify' }),
  tagTypes: [
    'Profile',
    'TopItems',
    'Artist',
    'Albums',
    'TopTracks',
    'Artists',
    'Album',
    'AlbumTracks',
    'NewReleases',
  ],
  endpoints: (builder) => ({
    // Auth status endpoint
    getAuthStatus: builder.query<AuthStatusResponse, void>({
      query: () => '/status',
    }),

    // User profile endpoint
    getProfile: builder.query<SpotifyProfile, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),

    // User's top items (artists or tracks)
    getTopItems: builder.query<
      TopItemsResponse<SpotifyArtist | SpotifyTrack>,
      TopItemsParams
    >({
      query: ({ type, timeRange = 'short_term', limit = 20, offset = 0 }) =>
        `/v1/user/top?type=${type}&time_range=${timeRange}&limit=${limit}&offset=${offset}`,
      providesTags: (result, error, { type, timeRange }) => [
        { type: 'TopItems', id: `${type}-${timeRange}` },
      ],
    }),

    // Get top artists
    getTopArtists: builder.query<
      TopItemsResponse<SpotifyArtist>,
      Omit<TopItemsParams, 'type'>
    >({
      query: ({ timeRange = 'short_term', limit = 20, offset = 0 }) =>
        `/v1/user/top?type=artists&time_range=${timeRange}&limit=${limit}&offset=${offset}`,
      providesTags: (result, error, { timeRange }) => [
        { type: 'TopItems', id: `artists-${timeRange}` },
      ],
    }),

    // Get top tracks
    getTopTracks: builder.query<
      TopItemsResponse<SpotifyTrack>,
      Omit<TopItemsParams, 'type'>
    >({
      query: ({ timeRange = 'short_term', limit = 20, offset = 0 }) =>
        `/v1/user/top?type=tracks&time_range=${timeRange}&limit=${limit}&offset=${offset}`,
      providesTags: (result, error, { timeRange }) => [
        { type: 'TopItems', id: `tracks-${timeRange}` },
      ],
    }),

    // Get single artist details
    getArtist: builder.query<ArtistDetails, string>({
      query: (artistId) => `/v1/artist/${artistId}`,
      providesTags: (result, error, id) => [{ type: 'Artist', id }],
    }),

    // Get artist's top tracks
    getArtistTopTracks: builder.query<ArtistTopTracksResponse, string>({
      query: (artistId) => `/v1/artists/${artistId}/top-tracks`,
      providesTags: (result, error, id) => [{ type: 'TopTracks', id }],
    }),

    // Get artist's albums
    getArtistAlbums: builder.query<ArtistAlbumsResponse, string>({
      query: (artistId) => `/v1/artists/${artistId}/albums`,
      providesTags: (result, error, id) => [{ type: 'Albums', id }],
    }),

    // Get multiple artists by IDs
    getMultipleArtists: builder.query<MultipleArtistsResponse, string[]>({
      query: (artistIds) => `/v1/artists?artist_ids=${artistIds.join(',')}`,
      providesTags: (result) =>
        result
          ? [
              ...result.artists.map(({ id }) => ({
                type: 'Artists' as const,
                id,
              })),
              { type: 'Artists', id: 'LIST' },
            ]
          : [{ type: 'Artists', id: 'LIST' }],
    }),

    // Get single album details
    getAlbum: builder.query<AlbumDetails, string>({
      query: (albumId) => `/v1/album/${albumId}`,
      providesTags: (result, error, id) => [{ type: 'Album', id }],
    }),

    // Get album tracks
    getAlbumTracks: builder.query<AlbumTracksResponse, string>({
      query: (albumId) => `/v1/albums/${albumId}/tracks`,
      providesTags: (result, error, id) => [{ type: 'AlbumTracks', id }],
    }),

    // Get new releases
    getNewReleases: builder.query<NewReleasesResponse, void>({
      query: () => '/v1/browse/new-releases',
      providesTags: ['NewReleases'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAuthStatusQuery,
  useGetProfileQuery,
  useGetTopItemsQuery,
  useGetTopArtistsQuery,
  useGetTopTracksQuery,
  useGetArtistQuery,
  useGetArtistTopTracksQuery,
  useGetArtistAlbumsQuery,
  useGetMultipleArtistsQuery,
  useGetAlbumQuery,
  useGetAlbumTracksQuery,
  useGetNewReleasesQuery,
} = spotifyApi;
