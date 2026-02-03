import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SoundCloudProfile } from '@/types/soundcloud';
import {
  SoundCloudActivity,
  SoundCloudActivityResponse,
  SoundCloudTrack,
} from '@/types/soundcloud';

// Response types
interface AuthStatusResponse {
  authenticated: boolean;
}

export interface SoundCloudTrackSearchRequest {
  q: string;
  ids?: string;
  urns?: string;
  limit?: number;
  linked_partitioning?: boolean;
}

export const soundcloudApi = createApi({
  reducerPath: 'soundcloudApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/soundcloud' }),
  tagTypes: [
    'SoundCloudProfile',
    'SoundCloudActivities',
    'SoundCloudLikesTracks',
    'SoundCloudSearch',
  ],
  endpoints: (builder) => ({
    // Auth status endpoint
    getAuthStatus: builder.query<AuthStatusResponse, void>({
      query: () => '/status',
    }),

    // User profile endpoint
    getSoundCloudProfile: builder.query<SoundCloudProfile, void>({
      query: () => '/profile',
      providesTags: ['SoundCloudProfile'],
    }),
    getSoundCloudLikedTracks: builder.query<SoundCloudTrack[], void>({
      query: () => '/v1/me/likes/tracks',
      providesTags: ['SoundCloudLikesTracks'],
    }),

    // User activities endpoint
    getSoundCloudActivities: builder.query<SoundCloudActivityResponse, void>({
      query: () => '/v1/me/activities/all/own',
      providesTags: ['SoundCloudActivities'],
    }),
    getSoundCloudSearch: builder.query<
      SoundCloudProfile,
      SoundCloudTrackSearchRequest
    >({
      query: ({ q, ids, limit, linked_partitioning, urns }) => {
        const params = new URLSearchParams();
        params.append('q', q);

        // Optional Params if existing
        if (ids) params.append('ids', ids);
        if (urns) params.append('urns', urns);
        if (limit !== undefined) params.append('limit', limit.toString());
        if (linked_partitioning !== undefined)
          params.append('linked_partitioning', linked_partitioning.toString());

        return `/v1/search?${params.toString()}`;
      },
      providesTags: ['SoundCloudSearch'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAuthStatusQuery,
  useGetSoundCloudProfileQuery,
  useGetSoundCloudLikedTracksQuery,
  useGetSoundCloudActivitiesQuery,
  useGetSoundCloudSearchQuery,
} = soundcloudApi;
