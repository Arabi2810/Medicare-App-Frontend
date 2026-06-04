/* eslint-disable @typescript-eslint/no-unused-vars */
import { showAlert } from '@src/helper/alert';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

const usePermission = () => {
  const cameraPermission = async (): Promise<boolean> => {
    const cameraPermissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    try {
      const status = await check(cameraPermissionType);
      switch (status) {
        case RESULTS.UNAVAILABLE:
          showAlert('Camera is not available on this device.');
          return false;
        case RESULTS.DENIED:
          const requestResult = await request(cameraPermissionType);
          return (
            requestResult === RESULTS.GRANTED ||
            requestResult === RESULTS.LIMITED
          );
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          showAlert('Camera permission is blocked. Redirecting to settings...');
          return false;
        default:
          return false;
      }
    } catch (error) {
      showAlert('Error checking camera permission:');
      return false;
    }
  };

  const galleryPermission = async (): Promise<boolean> => {
    const galleryPermissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    try {
      const status = await check(galleryPermissionType);
      switch (status) {
        case RESULTS.UNAVAILABLE:
          showAlert('Gallery is not available on this device.');
          return false;
        case RESULTS.DENIED:
          const requestResult = await request(galleryPermissionType);
          return (
            requestResult === RESULTS.GRANTED ||
            requestResult === RESULTS.LIMITED
          );
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          showAlert(
            'Gallery permission is blocked. Please enable it in settings.',
          );
          return false;
        default:
          return false;
      }
    } catch (error) {
      showAlert('Error checking gallery permission.');
      return false;
    }
  };

  const notificationPermission = async (): Promise<boolean> => {
    try {
      const settings = await notifee.requestPermission();

      const enabled =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Notification permission denied via Notifee');
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error checking notification permission via Notifee:', error);
      return false;
    }
  };

  const storagePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      return true;
    }

    if (Number(Platform.Version) >= 33) {
      return true;
    }

    try {
      const storage = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

      // For Android 12 and below
      const status = await check(storage);
      switch (status) {
        case RESULTS.UNAVAILABLE:
          showAlert('Storage is not available on this device.');
          return false;
        case RESULTS.DENIED:
          const requestResult = await request(storage);
          return requestResult === RESULTS.GRANTED;
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          showAlert(
            'Storage permission is blocked. Please enable it in settings.',
          );
          return false;
        default:
          return false;
      }
    } catch (error) {
      showAlert('Error checking storage permission.');
      return false;
    }
  };

  return {
    cameraPermission,
    galleryPermission,
    notificationPermission,
    storagePermission,
  };
};

export default usePermission;
