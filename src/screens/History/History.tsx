import { View, ActivityIndicator, StatusBar, FlatList } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { useGetPrescriptionsQuery } from '../../redux/pescription/pescription';
import HistoryCard from './HistoryCard';
import { Prescription } from '../../utils/types';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Screens';
import { useNavigation } from '@react-navigation/native';

const History = () => {
  const insets = useSafeAreaInsets();
  const styles = useStyle(insets);
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading, error } = useGetPrescriptionsQuery({});

  const prescriptions = Array.isArray(data) ? data : data?.data || [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MediCareText tag="body" color={theme.text[100]}>
        No prescriptions found
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
          Failed to load history.
        </MediCareText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.background[70]}
      />

      <View style={styles.header}>
        <MediCareText tag="h2" weight="Bold" color={theme.black}>
          All Prescriptions
        </MediCareText>
      </View>

      <FlatList
        data={prescriptions}
        keyExtractor={(item: Prescription) => item._id}
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() => navigation.navigate('HistoryDetails', { id: item._id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const useStyle = makeStyles((theme, insets: EdgeInsets) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[70],
    marginTop: insets.top,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[80],
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Added padding to avoid bottom tab bar
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
}));

export default History;
