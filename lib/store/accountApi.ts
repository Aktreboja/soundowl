import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/types/User';

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/account' }),
  tagTypes: ['Account'],
  endpoints: (builder) => ({
    getAccount: builder.query<User | null, { email: string }>({
      query: ({ email }) => ({
        url: `/?email=${encodeURIComponent(email)}`,
      }),
      providesTags: ['Account'],
    }),
    updateAccount: builder.mutation<User | null, User>({
      query: (account) => ({
        url: `/`,
        method: 'PUT',
        body: account,
      }),
      invalidatesTags: ['Account'],
    }),
  }),
});
export const { useGetAccountQuery, useUpdateAccountMutation } = accountApi;
