import { apiSlice } from '../api/apiSlice';

export const fcmApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    registerFcmToken: builder.mutation({
      query: data => ({
        url: '/api/fcm/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useRegisterFcmTokenMutation } = fcmApi;
