// src/screens/Dashboard/Dashboard.tsx
import { View, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import React from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import ActionTile from './components/ActionTile';
import MedicationsSection from './components/MedicationsSection';
import { CameraSvg, NotificationSvg } from '@src/utils/icons';
import {
  useTheme,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {
  BottomTabParamList,
  RootStackParamList,
} from '@src/navigation/Screens';
import HeaderSection from './components/HeaderSection';
import {
  useGetActiveMedicationsQuery,
  useGetTodayProgressQuery,
} from '@src/redux/pescription/pescription';
import { UploadFileType } from '../UploadPrescription/UploadPrescription';

const Dashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigationSwitch = useNavigation<NavigationProp<BottomTabParamList>>();
  const styles = useStyle();

  const { data: activeMedicationsData, isLoading } =
    useGetActiveMedicationsQuery({});

  // ← NEW: Fetch today's real progress
  const { data: todayProgressData } = useGetTodayProgressQuery({});

  const todayProgress = todayProgressData?.data;

  // Build progress bar values from real data
  const progressValue = todayProgress?.progress ?? 0;
  const taken = todayProgress?.taken ?? 0;
  const total = todayProgress?.total ?? 0;
  const missed = todayProgress?.missed ?? 0;

  // Progress bar text
  const progressTextRight =
    total > 0
      ? missed > 0
        ? `${taken} of ${total} · ${missed} missed`
        : `${taken} of ${total} doses`
      : '0 of 0 doses';

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle="light-content"
        animated
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection
          progressTextLeft="Today's Progress"
          progressTextRight={progressTextRight}
          progress={progressValue}
        />

        <View style={styles.tileRow}>
          <ActionTile
            title="Upload Prescription"
            subtitle="Scan & add medicines"
            Icon={CameraSvg}
            onPress={() =>
              navigation.navigate('UploadPrescription', {
                type: UploadFileType.Prescription,
              })
            }
          />
          <ActionTile
            title="Reminders"
            subtitle="View scheduled alerts"
            Icon={NotificationSvg}
            onPress={() => navigationSwitch.navigate('Reminders')}
          />
        </View>
        <View style={styles.more}>
          {!!activeMedicationsData && (
            <MedicationsSection
              items={activeMedicationsData?.data?.medications}
              activeCount={activeMedicationsData?.data?.totalMedications}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[80],
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 16,
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: -72,
    position: 'relative',
    zIndex: 10,
    paddingHorizontal: 20,
    gap: 16,
  },
  more: {
    paddingHorizontal: 20,
    gap: 16,
  },
}));