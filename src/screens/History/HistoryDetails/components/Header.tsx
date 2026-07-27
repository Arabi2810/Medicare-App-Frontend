import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';
import CloseIcon from '../../../../assets/icons/close.svg';
import { DoctorInfo } from '@src/utils/types';

interface Props {
  insets: EdgeInsets;
  doctor: DoctorInfo;
  isComplete?: boolean;
  onBack: () => void;
}

const Header: React.FC<Props> = ({ insets, doctor, isComplete, onBack }) => {
  const theme = useTheme();
  const styles = useStyle(insets);

  const isCompleted = isComplete;
  const statusBgColor = isCompleted
    ? theme.background[100] // Grey for Completed
    : theme.green[500] || '#22C55E'; // Vibrant Green for Active on dark header

  const statusTextColor = isCompleted ? theme.text[100] : theme.white;

  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerContent}>
        {/* Top Row: Close Icon, Doctor Info, Status Badge */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={onBack} style={styles.closeButton}>
            <CloseIcon width={24} height={24} color={theme.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <MediCareText tag="h2" weight="Bold" color={theme.white}>
              {doctor.name || 'Unknown Doctor'}
            </MediCareText>
            <MediCareText tag="body2" color={theme.indigo[100] || '#E0E7FF'}>
              {doctor.specialization || 'General Physician'}
            </MediCareText>
            {doctor.hospitalName ? (
              <MediCareText tag="body2" color={theme.indigo[100] || '#E0E7FF'}>
                {doctor.hospitalName}
              </MediCareText>
            ) : null}
          </View>

          <View
            style={[styles.statusBadge, { backgroundColor: statusBgColor }]}
          >
            <MediCareText tag="body2" weight="SemiBold" color={statusTextColor}>
              {isCompleted ? 'Completed' : 'Active'}
            </MediCareText>
          </View>
        </View>
      </View>
    </View>
  );
};

const useStyle = makeStyles((theme, insets: EdgeInsets) => ({
  headerBackground: {
    backgroundColor: theme.indigo[600] || '#4F46E5',
    paddingTop: insets.top + 10,
    paddingBottom: 60, // Extra padding for overlap
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    // Content wrapper
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
}));

export default Header;
