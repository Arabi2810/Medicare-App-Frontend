// src/screens/Reminders/Reminders.tsx
import {
  View,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { useGetRemindersQuery } from '../../redux/pescription/pescription';
import CloseIcon from '../../assets/icons/close.svg';
import NotificationIcon from '../../assets/icons/notification.svg';
import ReminderCard from './ReminderCard';
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleAllReminderAlarms, cancelAllReminderAlarms } from '@src/utils/alarmScheduler';

const Reminders = () => {
  const styles = useStyle();
  const theme = useTheme();
  const navigation = useNavigation();
  const { data, isLoading, error, refetch, isFetching } = useGetRemindersQuery({});

  const reminders = Array.isArray(data) ? data : data?.data || [];
  const scheduledCount = reminders.length;
  

  useEffect(() => {
    if (!reminders || reminders.length === 0) return;
    AsyncStorage.getItem('medicationRemindersEnabled').then(async val => {
      if (val === 'false') {
        await cancelAllReminderAlarms(reminders);
      } else {
        await scheduleAllReminderAlarms(reminders);
      }
    });
  }, [reminders]);

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MediCareText tag="body" color={theme.text[100]}>
        No reminders available
      </MediCareText>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error && !data) {
    const isNetworkError = (error as any)?.status === 'FETCH_ERROR' || !(error as any)?.status;
    return (
      <View style={[styles.container, styles.center]}>
        <MediCareText tag="h4" weight="SemiBold" color={theme.text[100]}>
          {isNetworkError ? 'No internet connection' : 'Something went wrong'}
        </MediCareText>
        <MediCareText
          tag="body2"
          color={theme.text[80]}
          style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 30 }}
        >
          {isNetworkError
            ? 'Check your connection and try again. Already-scheduled reminders will still go off on time.'
            : 'Please try again in a moment.'}
        </MediCareText>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
          <MediCareText color={theme.white} weight="SemiBold">
            {isFetching ? 'Retrying...' : 'Retry'}
          </MediCareText>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} style={styles.closeBtn}>
            <CloseIcon width={24} height={24} color={theme.white} />
          </TouchableOpacity>
          <MediCareText tag="h2" weight="Bold" color={theme.white}>
            Reminders
          </MediCareText>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.summaryCard}>
          <View>
            <MediCareText tag="body" color={theme.whiteTransparent}>
              Today
            </MediCareText>
            <MediCareText tag="h2" weight="Bold" color={theme.white} style={{ marginTop: 4 }}>
              {scheduledCount} doses scheduled
            </MediCareText>
          </View>
          <NotificationIcon width={28} height={28} color={theme.white} />
        </View>
      </View>
      <FlatList
        data={reminders}
        keyExtractor={(item, index) => ((item as any)?._id ? String((item as any)._id) : index.toString())}
        renderItem={({ item }) => <ReminderCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const useStyle = makeStyles(theme => ({
  container: { flex: 1, backgroundColor: theme.background[70], paddingBottom: 60 },
  center: { justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    backgroundColor: theme.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeBtn: { padding: 4 },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: { padding: 20, paddingTop: 20, paddingBottom: 40 },
  emptyState: { alignItems: 'center', marginTop: 40 },
  retryBtn: {
    marginTop: 20,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
}));

export default Reminders;