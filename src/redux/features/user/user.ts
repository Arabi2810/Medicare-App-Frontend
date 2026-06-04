import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: data => ({
        url: `/api/auth/login`,
        method: 'POST',
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: data => ({
        url: `/api/auth/signup/email`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = userApi;
