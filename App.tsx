// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import store from '@src/redux/store';
import Root from '@src/navigation/Root';
import { ThemeProvider, useAppTheme } from '@src/context/ThemeContext';
import { ToastProvider, setGlobalToast } from '@src/components/Toast/ToastProvider';
import { useToast } from '@src/components/Toast/ToastProvider';
import { ToastType } from '@src/components/Toast/Toast';
import { Platform, Linking } from 'react-native';

const ToastBridge: React.FC = () => {
  const { showToast } = useToast();
  useEffect(() => {
    setGlobalToast((message: string, type?: ToastType) => showToast(message, type));
    return () => setGlobalToast(() => {});
  }, [showToast]);
  return null;
};

async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'medication_reminders',
    name: 'Medication Reminders',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
  await notifee.createChannel({
    id: 'alarm_channel',
    name: 'Medicine Alarm',
    importance: AndroidImportance.HIGH,
    sound: 'alarm_sound',
    vibration: true,
    vibrationPattern: [500, 500, 500],
  });
}

async function displayMedicationNotification(title: string, body: string, data?: Record<string, string>) {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'medication_reminders',
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
      actions: [
        { title: 'Took It', pressAction: { id: 'took_it' } },
        { title: 'Remind Later', pressAction: { id: 'remind_later' } },
      ],
    },
    data,
  });
}

const AppInner: React.FC = () => {
  const [channelReady, setChannelReady] = React.useState(false);

  useEffect(() => {
 (async () => {
      await notifee.requestPermission();
      await createNotificationChannel();
      setChannelReady(true);
      if (Platform.OS === 'android' && Platform.Version >= 31) {
        const settings = await notifee.getNotificationSettings();
        if (settings.android?.alarm !== 1) {
          await notifee.openAlarmPermissionSettings();
        }
      }

      const unsubscribeFCM = messaging().onMessage(async remoteMessage => {
        const title = remoteMessage.notification?.title || 'Medication Reminder';
        const body = remoteMessage.notification?.body || 'Time to take your medicine';
        await displayMedicationNotification(title, body, remoteMessage.data as Record<string, string>);
      });

      const unsubscribeNotifee = notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type === EventType.ACTION_PRESS) {
          const actionId = detail.pressAction?.id;
          const reminderId = detail.notification?.data?.reminderId as string | undefined;

          if (actionId === 'took_it' && reminderId) {
            try {
              const token = store.getState().auth?.token;
              if (token) {
                await fetch(
                  `${require('react-native-config').default.API_BASE_URL}/api/reminders/${reminderId}/taken`,
                  { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
                );
              }
            } catch (e) {
              console.warn('Mark taken failed:', e);
            }
          }

          if (actionId === 'remind_later') {
            await notifee.createTriggerNotification(
              {
                title: detail.notification?.title ?? 'Medication Reminder',
                body: detail.notification?.body ?? 'Time to take your medicine',
                android: { channelId: 'medication_reminders', importance: AndroidImportance.HIGH },
                data: detail.notification?.data,
              },
              { type: 1, timestamp: Date.now() + 30 * 60 * 1000 } as any,
            );
          }
          await notifee.cancelNotification(detail.notification?.id ?? '');
        }
      });

      return () => { unsubscribeFCM(); unsubscribeNotifee(); };
    })();
  }, []);

if (!channelReady) {
    return null;
  }

  return <Root />;
};

// Separate component so useAppTheme works inside ThemeProvider
const ThemedApp: React.FC = () => {
  const { theme } = useAppTheme();
  return (
    <NavigationContainer theme={theme}>
      <ToastProvider>
        <ToastBridge />
        <AppInner />
      </ToastProvider>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <ThemedApp />
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({ flex: { flex: 1 } });

export default App;