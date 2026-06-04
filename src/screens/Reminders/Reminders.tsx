import {
  View,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { useGetRemindersQuery } from '../../redux/pescription/pescription';
import CloseIcon from '../../assets/icons/close.svg';
import NotificationIcon from '../../assets/icons/notification.svg';
import ReminderCard from './ReminderCard';

const Reminders = () => {
  const styles = useStyle();
  const theme = useTheme();
  const navigation = useNavigation();
  const { data, isLoading, error } = useGetRemindersQuery({});

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const reminders = Array.isArray(data) ? data : data?.data || [];
  const scheduledCount = reminders.length;

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

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <MediCareText color={theme.error[100]}>
          Failed to load reminders.
        </MediCareText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

      {/* Header Section - Static */}
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

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View>
            <MediCareText tag="body" color={theme.whiteTransparent}>
              Today
            </MediCareText>
            <MediCareText
              tag="h2"
              weight="Bold"
              color={theme.white}
              style={{ marginTop: 4 }}
            >
              {scheduledCount} doses scheduled
            </MediCareText>
          </View>
          <NotificationIcon width={28} height={28} color={theme.white} />
        </View>
      </View>

      {/* Reminders List */}
      <FlatList
        data={reminders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ReminderCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[70],
    paddingBottom: 60,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  closeBtn: {
    padding: 4,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
}));

export default Reminders;
