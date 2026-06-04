import { Alert } from 'react-native';

export const showError = (error?: any) => {
  console.log(error);
  if (error && 'status' in error) {
    switch (error.status) {
      case 'FETCH_ERROR':
        showAlert("Sorry we couldn't process your request");
        break;
      default:
        showAlert((error.data as any)?.error);
    }
  } else if (error && error.message) {
    showAlert(error.message);
  } else {
    showAlert();
  }
};

export const showAlert = (message?: string) => {
  Alert.alert('Error', message ?? 'Something went wrong. Please try again.', [
    { text: 'Ok' },
  ]);
};
export const successAlert = (message: string) => {
  Alert.alert('Success', message, [{ text: 'Ok' }]);
};
