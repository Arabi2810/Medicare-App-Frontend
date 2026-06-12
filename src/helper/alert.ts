// src/helper/alert.ts
// Uses the global toast bridge when available (set up in App.tsx),
// falls back to console.warn in non-UI contexts.
import { globalShowToast } from '@src/components/Toast/ToastProvider';

export const showError = (error?: any) => {
  console.log(error);
  if (error && 'status' in error) {
    switch (error.status) {
      case 'FETCH_ERROR':
        showAlert("Couldn't reach the server. Check your connection.");
        break;
      default:
        showAlert((error.data as any)?.error || 'Something went wrong');
    }
  } else if (error && error.message) {
    showAlert(error.message);
  } else {
    showAlert();
  }
};

export const showAlert = (message?: string) => {
  globalShowToast(
    message ?? 'Something went wrong. Please try again.',
    'error',
  );
};

export const successAlert = (message: string) => {
  globalShowToast(message, 'success');
};

export const warningAlert = (message: string) => {
  globalShowToast(message, 'warning');
};

export const infoAlert = (message: string) => {
  globalShowToast(message, 'info');
};