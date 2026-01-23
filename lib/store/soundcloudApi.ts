import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SoundCloudProfile } from '@/types';
import {
  SoundCloudActivity,
  SoundCloudActivityResponse,
  SoundCloudTrack,
} from '@/types/soundcloud';

// Response types
interface AuthStatusResponse {
  authenticated: boolean;
}

export const soundcloudApi = createApi({
  reducerPath: 'soundcloudApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/soundcloud' }),
  tagTypes: [
    'SoundcloudProfile',
    'SoundcloudActivities',
    'SoundcloudLikesTracks',
  ],
  endpoints: (builder) => ({
    // Auth status endpoint
    getAuthStatus: builder.query<AuthStatusResponse, void>({
      query: () => '/status',
    }),

    // User profile endpoint
    getSoundCloudProfile: builder.query<SoundCloudProfile, void>({
      query: () => '/profile',
      providesTags: ['SoundcloudProfile'],
    }),
    getSoundCloudLikedTracks: builder.query<SoundCloudTrack[], void>({
      query: () => '/v1/me/likes/tracks',
      providesTags: ['SoundcloudLikesTracks'],
    }),

    // User activities endpoint
    getSoundCloudActivities: builder.query<SoundCloudActivityResponse, void>({
      query: () => '/v1/me/activities/all/own',
      providesTags: ['SoundcloudActivities'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAuthStatusQuery,
  useGetSoundCloudProfileQuery,
  useGetSoundCloudLikedTracksQuery,
  useGetSoundCloudActivitiesQuery,
} = soundcloudApi;
