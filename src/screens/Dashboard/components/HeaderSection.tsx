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
}

const HeaderSection: React.FC<Props> = ({
  progressTextLeft,
  progressTextRight,
  progress,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const user = useAppSelector(state => state.auth).user;
  const styles = useStyle({ insets });
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.greetingLeft}>
          <MediCareText
            tag="h1"
            weight={FontWeight.Bold}
            color={styles.headerText.color as string}
          >
            {`Hello, ${user?.fullName}!`}
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
            color={styles.progressText.color as string}
          >
            {progressTextRight}
          </MediCareText>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Logo removed as requested */}
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
    height: 6,
    backgroundColor: theme.background[90],
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: theme.primary,
    borderRadius: 6,
  },
  // Logo container removed
}));
