import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import PulseIcon from '../../assets/icons/pulse.svg';
import { makeStyles } from '../../hooks/makeStyle';
import { MostUsedMedicine } from '../../utils/types';

interface Props {
  data: MostUsedMedicine[];
}

const MostUsedMedicines: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const styles = useStyle();
  const medicines = data || [];

  const barColors = ['#00B84A', '#2563EB', '#A855F7', '#F59E0B'];
  const trackColors = ['#E6F7ED', '#EBF2FE', '#F3E8FF', '#FEF3C7'];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MediCareText tag="h3" weight="Bold">
          Most Used Medicines
        </MediCareText>
        <PulseIcon width={20} height={20} color={theme.success} />
      </View>

      {medicines.map((med, index) => {
        const color = barColors[index % barColors.length];
        const trackColor = trackColors[index % trackColors.length];
        return (
          <View key={index} style={styles.medicineStatsRow}>
            <View style={styles.medicineInfoRow}>
              <MediCareText
                tag="body"
                weight="SemiBold"
                style={{ flexShrink: 1 }}
              >
                {med.name}
              </MediCareText>
              <MediCareText tag="body2" color={theme.text[100]}>
                {med.count} times
              </MediCareText>
            </View>
            <View
              style={[styles.progressBarTrack, { backgroundColor: trackColor }]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${med.percentage || 0}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const useStyle = makeStyles(theme => ({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicineStatsRow: {
    marginBottom: 16,
  },
  medicineInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    backgroundColor: theme.background[50],
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
}));

export default MostUsedMedicines;
