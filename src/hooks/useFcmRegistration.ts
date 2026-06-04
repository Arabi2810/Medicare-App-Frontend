import messaging from '@react-native-firebase/messaging';
import { useRegisterFcmTokenMutation } from '@src/redux/features/fcm/fcmApi';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import usePermission from './usePermission';

const useFcmRegistration = () => {
  const [registerFcmToken] = useRegisterFcmTokenMutation();
  const { notificationPermission } = usePermission();

  const registerToken = async () => {
    try {
      const hasPermission = await notificationPermission();
      if (!hasPermission) return;

      const token = await messaging().getToken();
      const deviceId = await DeviceInfo.getUniqueId();
      const platform = Platform.OS;

      console.log('Registering FCM Token:', { token, platform, deviceId });

      await registerFcmToken({ token, platform, deviceId }).unwrap();
    } catch (error) {
      console.log('FCM registration error:', error);
    }
  };

  return { registerToken };
};

export default useFcmRegistration;
