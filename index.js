LogBox.ignoreAllLogs();
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

if (__DEV__) {
  require('./ReactotronConfig');
}

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  // Stop if the system already handled it (Notification Message)
  if (remoteMessage.notification) {
    return;
  }

  // Stop if there is no data to display
  // We only show a notification if the data payload contains a title or body.
  const dataTitle = remoteMessage.data?.title;
  const dataBody = remoteMessage.data?.body;

  if (!dataTitle && !dataBody) {
    console.log('SKIPPING NOTIFICATION: Empty data payload found.');
    return;
  }

  console.log('VALID NOTIFICATION: Proceeding to display.');

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'alarm_channel',
    name: 'Alarm Channel',
    sound: 'alarm_sound', // The user must provide this file in android/app/src/main/res/raw/
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    id: remoteMessage.messageId, // Use FCM messageId to prevent duplicates
    title: dataTitle || 'New Notification',
    body: dataBody || 'You have a new message',
    android: {
      channelId,
      sound: 'alarm_sound',
      pressAction: {
        id: 'default',
      },
      // Loop the sound if needed, or just let it play.
      // For 10s duration, the sound file itself should be 10s.
    },
  });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (type === EventType.PRESS && pressAction?.id === 'default') {
    console.log('User pressed notification', notification);
    // Handle press action if needed
  }
});

const AddProvider = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => AddProvider);
