import { apiSlice } from '../features/api/apiSlice';

export const prescriptionApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getActiveMedications: builder.query({
      query: () => ({ url: '/api/prescriptions/active-medications' }),
      providesTags: ['ActiveMedications'],
    }),
    getReminders: builder.query({
      query: () => ({ url: '/api/prescriptions/reminders' }),
      providesTags: ['Reminders'],
    }),
    getPrescriptions: builder.query({
      query: () => ({ url: '/api/prescriptions' }),
      providesTags: ['Prescriptions'],
    }),
    getAnalytics: builder.query({
      query: () => ({ url: 'api/prescriptions/insights' }),
      providesTags: ['Analytics'],
    }),
    getPrescriptionDetails: builder.query({
      query: (id: string) => ({ url: `api/prescriptions/${id}/details` }),
    }),
    getPendingTests: builder.query({
      query: () => ({ url: 'api/prescriptions/tests/pending' }),
      providesTags: ['PendingTests'],
    }),
    updateReminder: builder.mutation({
      query: ({ reminderId, data }: { reminderId: string; data: any }) => ({
        url: `api/prescriptions/reminders/${reminderId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Reminders'],
    }),
    completeTestReport: builder.mutation({
      query: ({
        prescriptionId,
        testId,
        data,
      }: {
        prescriptionId: string;
        testId: string;
        data: FormData;
      }) => ({
        url: `api/prescriptions/${prescriptionId}/tests/${testId}/complete`,
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['PendingTests'],
    }),
    completePrescription: builder.mutation({
      query: (data) => ({
        url: `api/prescriptions/${data.prescriptionId}/complete`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Prescriptions', 'ActiveMedications'],
    }),
    deletePrescription: builder.mutation({
      query: (id: string) => ({
        url: `api/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prescriptions', 'ActiveMedications', 'Reminders'],
    }),
    getClinicalSummary: builder.query({
      query: () => ({ url: '/api/prescriptions/clinical-summary' }),
    }),
    getClinicalSummaryPdf: builder.query({
      query: () => ({
        url: 'api/prescriptions/clinical-summary/pdf',
        responseHandler: (response: any) => response.text(),
      }),
    }),
    getSideEffects: builder.query({
      query: () => ({ url: '/api/prescriptions/side-effects' }),
    }),
    getHealthTimeline: builder.query({
      query: () => ({ url: '/api/prescriptions/health-timeline' }),
    }),
    getCaseDocumentation: builder.query({
      query: () => ({ url: '/api/prescriptions/case-documentation' }),
    }),
  }),
});

export const {
  useGetActiveMedicationsQuery,
  useGetRemindersQuery,
  useGetPrescriptionsQuery,
  useGetAnalyticsQuery,
  useGetPrescriptionDetailsQuery,
  useGetPendingTestsQuery,
  useCompleteTestReportMutation,
  useCompletePrescriptionMutation,
  useGetClinicalSummaryQuery,
  useGetClinicalSummaryPdfQuery,
  useGetSideEffectsQuery,
  useGetHealthTimelineQuery,
  useGetCaseDocumentationQuery,
  useDeletePrescriptionMutation,
  useUpdateReminderMutation,
} = prescriptionApi;
