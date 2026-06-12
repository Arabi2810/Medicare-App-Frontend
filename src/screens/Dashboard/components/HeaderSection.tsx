// src/screens/Dashboard/components/HeaderSection.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { MenuSvg } from '@src/utils/icons';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '@src/navigation/Screens';
import { useAppSelector } from '@src/redux/store';

interface Props {
  progressTextLeft: string;
  progressTextRight: string;
  progress: number; // 0..1
  missed?: number;  // ← NEW: how many missed today
}

const HeaderSection: React.FC<Props> = ({
  progressTextLeft,
  progressTextRight,
  progress,
  missed = 0,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const user = useAppSelector(state => state.auth).user;
  const styles = useStyle({ insets });

  // Progress bar: taken (green) + missed (red) + pending (grey)
  const takenWidth: `${number}%` = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.greetingLeft}>
          <MediCareText
            tag="h1"
            weight={FontWeight.Bold}
            color={styles.headerText.color as string}
          >
            {`Hello, ${user?.fullName ?? 'there'}!`}
          </MediCareText>
          <MediCareText
            tag="body2"
            weight={FontWeight.Regular}
            color={styles.headerSubText.color as string}
          >
            Stay healthy, stay happy
          </MediCareText>
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MenuSvg
            stroke={styles.headerText.color as string}
            height={22}
            width={22}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <MediCareText
            tag="body"
            weight={FontWeight.Medium}
            color={styles.progressText.color as string}
          >
            {progressTextLeft}
          </MediCareText>
          <MediCareText
            tag="body2"
            weight={FontWeight.Medium}
            color={missed > 0 ? '#EF4444' : styles.progressText.color as string}
          >
            {progressTextRight}
          </MediCareText>
        </View>

        {/* Progress bar track */}
        <View style={styles.progressBarTrack}>
          {/* Taken — green fill */}
          <View
            style={[
              styles.progressBarFill,
              { width: takenWidth },
            ]}
          />
          {/* Missed indicator — red dot at end of fill if any missed */}
          {missed > 0 && (
            <View style={styles.missedDot} />
          )}
        </View>

        {/* Missed warning text */}
        {missed > 0 && (
          <MediCareText tag="body2" color="#EF4444" style={styles.missedText}>
            {`⚠️ ${missed} medicine${missed > 1 ? 's' : ''} missed today`}
          </MediCareText>
        )}
      </View>
    </View>
  );
};

export default HeaderSection;

interface StyleProp {
  insets: EdgeInsets;
}

const useStyle = makeStyles((theme, props: StyleProp) => ({
  container: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingBottom: 84,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'relative',
    zIndex: 1,
    paddingTop: props.insets.top,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingLeft: {
    flexDirection: 'column',
  },
  headerText: {
    color: theme.white,
  },
  headerSubText: {
    color: theme.white,
  },
  progressCard: {
    backgroundColor: theme.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    color: theme.text[100],
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: theme.background[90],
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: theme.primary,
    borderRadius: 6,
  },
  missedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  missedText: {
    marginTop: 6,
  },
}));