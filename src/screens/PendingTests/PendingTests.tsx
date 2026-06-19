import {
  View,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { useGetPendingTestsQuery } from '../../redux/pescription/pescription';
import CloseIcon from '../../assets/icons/close.svg';
import PendingTestCard from './PendingTestCard';
import EmptyPendingTests from './EmptyPendingTests';
import { DrawerParamList } from '../../navigation/Screens';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PendingTest } from '../../utils/types';

type PendingTestsNavigationProp = DrawerNavigationProp<
  DrawerParamList,
  'PendingTests'
>;

const PendingTests = () => {
  const styles = useStyle();
  const theme = useTheme();
  const navigation = useNavigation<PendingTestsNavigationProp>();
  const { data, isLoading, error, refetch, isFetching } = useGetPendingTestsQuery(
    {},
  );

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback if no history, though ideally specific navigation handles this
      navigation.navigate('Dashboard', { screen: 'Home' });
    }
  };

  const pendingTests: PendingTest[] = data?.data || [];
  const testsCount = pendingTests.length;

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
            ? 'Check your connection and try again.'
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

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} style={styles.closeBtn}>
            <CloseIcon width={24} height={24} color={theme.white} />
          </TouchableOpacity>
          <MediCareText tag="h2" weight="Bold" color={theme.white}>
            Pending Tests
          </MediCareText>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <MediCareText tag="h1" weight="Bold" color={theme.white}>
            {testsCount}
          </MediCareText>
          <MediCareText tag="body" color={theme.whiteTransparent}>
            Tests Remaining
          </MediCareText>
        </View>
      </View>

      {/* Tests List */}
      <FlatList
        data={pendingTests}
        keyExtractor={(item, index) => item.testId || index.toString()}
        renderItem={({ item }) => <PendingTestCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyPendingTests}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />
    </View>
  );
};

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[70],
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
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
}));

export default PendingTests;
