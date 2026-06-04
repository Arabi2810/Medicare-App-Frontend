import { NavigationContainer } from '@react-navigation/native';
import Root from '@src/navigation/Root';
import { createLightTheme } from '@src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useAppDispatch } from '@src/redux/store';
import { initAuth } from '@src/redux/features/user/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);
  
  useEffect(() => {
    const requestNotificationPermission = async () => {
      await notifee.requestPermission();
    };
    requestNotificationPermission();
  }, []);
  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    await notifee.deleteChannel('alarm_channel');
    const channelId = await notifee.createChannel({
      id: 'alarm_channel',
      name: 'Medication Alarms',
      sound: 'alarm_sound',
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [500, 500, 500],
    });
     const title: string =
      remoteMessage.notification?.title ??
      (remoteMessage.data?.title as string | undefined) ??
      'New Notification';

    const body: string =
      remoteMessage.notification?.body ??
      (remoteMessage.data?.body as string | undefined) ??
      'You have a new message';
      await notifee.displayNotification({
        id: remoteMessage.messageId ?? 'default-id',
        title,
        body,
        android: { channelId, sound: 'alarm_sound', pressAction: { id: 'default' } },
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
  const setupChannel = async () => {
    await notifee.deleteChannel('alarm_channel');
    await notifee.createChannel({
      id: 'alarm_channel',
      name: 'Medication Alarms',
      sound: 'alarm_sound',
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [500, 500, 500],
    });
  };
  setupChannel();
}, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={createLightTheme()}>
        <Root />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;