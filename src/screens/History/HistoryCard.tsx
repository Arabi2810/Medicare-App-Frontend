import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { Prescription } from '../../utils/types';
import PulseIcon from '../../assets/icons/pulse.svg';
import InsightsIcon from '../../assets/icons/insights.svg'; // Using as generic doc/test icon

interface Props {
  item: Prescription;
  onPress: () => void;
}

const HistoryCard: React.FC<Props> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = useStyle();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Format: YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const isCompleted = item.isComplete;
  const statusColor = isCompleted
    ? theme.background[100] // Greyish for Completed
    : theme.green[100] || '#DCFCE7'; // Light Green for Active

  const statusTextColor = isCompleted
    ? theme.text[100]
    : theme.green[800] || '#166534'; // Dark Green for Active

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <MediCareText tag="body2" color={theme.text[100]}>
          {formatDate(item.createdAt || item.uploadedAt)}
        </MediCareText>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <MediCareText tag="body2" weight="SemiBold" color={statusTextColor}>
            {isCompleted ? 'Completed' : 'Active'}
          </MediCareText>
        </View>
      </View>

      <MediCareText
        tag="h3"
        weight="Bold"
        color={theme.black}
        style={styles.doctorName}
      >
        {item.doctor?.name || 'Unknown Doctor'}
      </MediCareText>
      <MediCareText
        tag="body"
        color={theme.text[100]}
        style={styles.hospitalName}
      >
        {item.doctor?.specialization || 'Hospital info not available'}
      </MediCareText>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <PulseIcon width={16} height={16} stroke={theme.text[100]} />
          <MediCareText
            tag="body"
            color={theme.text[100]}
            style={styles.statText}
          >
            {item.medicines?.length || 0} medicines
          </MediCareText>
        </View>
        <View style={styles.statItem}>
          {/* Using InsightsIcon as a placeholder for tests/documents */}
          <InsightsIcon width={16} height={16} color={theme.text[100]} />
          <MediCareText
            tag="body"
            color={theme.text[100]}
            style={styles.statText}
          >
            {item.tests?.length || 0} tests
          </MediCareText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyle = makeStyles(theme => ({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.border[80],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  doctorName: {
    marginBottom: 4,
  },
  hospitalName: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 6,
  },
}));

export default HistoryCard;
