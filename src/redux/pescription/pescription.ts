// src/redux/pescription/pescription.ts
import { apiSlice } from '../features/api/apiSlice';

export const prescriptionApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getActiveMedications: builder.query({
      query: () => ({ url: '/api/prescriptions/active-medications' }),
      providesTags: ['ActiveMedications'],
      keepUnusedDataFor: 86400,
    }),
    getReminders: builder.query({
      query: () => ({ url: '/api/prescriptions/reminders' }),
      providesTags: ['Reminders'],
      keepUnusedDataFor: 86400,
    }),
    getPrescriptions: builder.query({
      query: () => ({ url: '/api/prescriptions' }),
      providesTags: ['Prescriptions'],
      keepUnusedDataFor: 86400,
    }),
    getAnalytics: builder.query({
      query: () => ({ url: 'api/prescriptions/insights' }),
      providesTags: ['Analytics'],
      keepUnusedDataFor: 86400,
    }),
    getPrescriptionDetails: builder.query({
      query: (id: string) => ({ url: `api/prescriptions/${id}/details` }),
      keepUnusedDataFor: 86400,
    }),
    getPendingTests: builder.query({
      query: () => ({ url: 'api/prescriptions/tests/pending' }),
      providesTags: ['PendingTests'],
      keepUnusedDataFor: 86400,
    }),
    updateReminder: builder.mutation({
      query: ({ reminderId, data }: { reminderId: string; data: any }) => ({
        url: `api/prescriptions/reminders/${reminderId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Reminders'],
    }),
    updatePrescription: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `api/prescriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Prescriptions', 'Reminders', 'ActiveMedications'],
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
        headers: { 'Content-Type': 'multipart/form-data' },
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
    // Clinical summary tabs — cached for 10 minutes so switching tabs doesn't re-fetch
    getClinicalSummary: builder.query({
      query: () => ({ url: '/api/prescriptions/clinical-summary' }),
      keepUnusedDataFor: 600,
    }),
    getClinicalSummaryPdf: builder.query({
      query: () => ({
        url: 'api/prescriptions/clinical-summary/pdf',
        responseHandler: (response: any) => response.text(),
      }),
    }),
    getSideEffects: builder.query({
      query: () => ({ url: '/api/prescriptions/side-effects' }),
      keepUnusedDataFor: 600,
    }),
    getHealthTimeline: builder.query({
      query: () => ({ url: '/api/prescriptions/health-timeline' }),
      keepUnusedDataFor: 600,
    }),
    getCaseDocumentation: builder.query({
      query: () => ({ url: '/api/prescriptions/case-documentation' }),
      keepUnusedDataFor: 600,
    }),

    // ============================================
    // DAILY LOG ENDPOINTS
    // ============================================
    getTodayProgress: builder.query({
      query: () => ({ url: '/api/daily-log/today' }),
      providesTags: ['DailyLog'],
      keepUnusedDataFor: 86400,
    }),
    getMissedMedicines: builder.query({
      query: () => ({ url: '/api/daily-log/missed' }),
      providesTags: ['DailyLog'],
      keepUnusedDataFor: 86400,
    }),
    markMedicineTaken: builder.mutation({
      query: (logId: string) => ({
        url: '/api/daily-log/mark-taken',
        method: 'POST',
        body: { logId },
      }),
      invalidatesTags: ['DailyLog'],
    }),
    markTakenByReminder: builder.mutation({
      query: ({ reminderId, slot }: { reminderId: string; slot: string }) => ({
        url: '/api/daily-log/mark-taken-by-reminder',
        method: 'POST',
        body: { reminderId, slot },
      }),
      invalidatesTags: ['DailyLog'],
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
  useUpdatePrescriptionMutation,
  useGetTodayProgressQuery,
  useGetMissedMedicinesQuery,
  useMarkMedicineTakenMutation,
  useMarkTakenByReminderMutation,
} = prescriptionApi;