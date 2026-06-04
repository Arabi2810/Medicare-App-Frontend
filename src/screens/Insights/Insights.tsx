import { View, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { useGetAnalyticsQuery } from '../../redux/pescription/pescription';
import InsightsHeader from './InsightsHeader';
import MostUsedMedicines from './MostUsedMedicines';
import CommonSymptoms from './CommonSymptoms';
import TreatmentStats from './TreatmentStats';

const Insights = () => {
  const styles = useStyle();
  const theme = useTheme();
  const { data: analytics, isLoading, error } = useGetAnalyticsQuery({});

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
          Failed to load insights.
        </MediCareText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InsightsHeader />

        <View style={styles.contentContainer}>
          <MostUsedMedicines data={analytics?.data?.mostUsedMedicines || []} />
          <CommonSymptoms data={analytics?.data?.commonSymptoms || []} />
          <TreatmentStats data={analytics?.data?.treatmentStats} />
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -30, // Overlap the header
  },
}));

export default Insights;
