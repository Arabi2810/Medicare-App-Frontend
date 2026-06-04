import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query({
      query: () => ({ url: '/api/users/profile' }),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/api/users/account',
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useDeleteAccountMutation} = userApi;