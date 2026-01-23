import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SoundCloudProfile } from '@/types';

// Response types
interface AuthStatusResponse {
  authenticated: boolean;
}

export const soundcloudApi = createApi({
  reducerPath: 'soundcloudApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/soundcloud' }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Auth status endpoint
    getAuthStatus: builder.query<AuthStatusResponse, void>({
      query: () => '/status',
    }),

    // User profile endpoint
    getSoundCloudProfile: builder.query<SoundCloudProfile, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetAuthStatusQuery, useGetSoundCloudProfileQuery } =
  soundcloudApi;
