import React, { useEffect } from 'react';
import StackNavigation from './Stack';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { initAuth } from '@src/redux/features/user/authSlice';
import { ActivityIndicator, View } from 'react-native';
import { useGetRemindersQuery } from '@src/redux/pescription/pescription';
import { scheduleAllReminderAlarms, cancelAllReminderAlarms } from '@src/utils/alarmScheduler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Root = () => {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(state => state.auth.hydrated);
  const token = useAppSelector(state => state.auth.token);

  useEffect(() => {
    dispatch(initAuth());
  }, []);

  const { data: remindersData } = useGetRemindersQuery(undefined, {
    skip: !hydrated || !token,
  });

  useEffect(() => {
    const reminders = Array.isArray(remindersData) ? remindersData : remindersData?.data || [];
    if (!reminders || reminders.length === 0) return;

    AsyncStorage.getItem('medicationRemindersEnabled').then(async val => {
      if (val === 'false') {
        await cancelAllReminderAlarms(reminders);
      } else {
        await scheduleAllReminderAlarms(reminders);
      }
    });
  }, [remindersData]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return <StackNavigation />;
};

export default Root;