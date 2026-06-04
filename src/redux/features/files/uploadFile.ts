import { apiSlice } from '../api/apiSlice';

export const uploadFileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    uploadFile: builder.mutation({
      query: payload => ({
        url: '/api/prescriptions/upload',
        method: 'POST',
        body: payload,
      }),
    }),
    save: builder.mutation({
      query: payload => ({
        url: '/api/prescriptions/save',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ActiveMedications', 'Reminders', 'Prescriptions', 'Analytics'],
    }),
  }),
});

export const { useUploadFileMutation, useSaveMutation } = uploadFileApi;
