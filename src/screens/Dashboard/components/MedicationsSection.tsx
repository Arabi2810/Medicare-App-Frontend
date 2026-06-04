import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';

interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescriptionId: string;
  doctorName: string;
  prescribedDate: string;
  patientName: string;
}

interface Props {
  title?: string;
  activeCount?: string;
  items: MedicationItem[];
}

const MedicationsSection: React.FC<Props> = ({
  title = 'Active Medications',
  activeCount,
  items,
}) => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MediCareText tag="h3" weight={FontWeight.SemiBold}>
          {title}
        </MediCareText>
        <MediCareText tag="body2" color={styles.activeText.color as string}>
          {`${activeCount} active`}
        </MediCareText>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.medCard}>
          <View style={styles.medLeft}>
            <MediCareText tag="h4" weight={FontWeight.SemiBold}>
              {item.name}
            </MediCareText>
            <MediCareText tag="body2" color={styles.subText.color as string}>
              {`${item.dosage}${item.frequency ? ` . ${item.frequency}` : ''}`}
            </MediCareText>
          </View>
          <View style={styles.medRight}>
            <MediCareText
              tag="body2"
              color={styles.daysText.color as string}
              weight={FontWeight.SemiBold}
            >
              {item.duration}
            </MediCareText>
            <MediCareText tag="body2" color={styles.subText.color as string}>
              prescribed
            </MediCareText>
          </View>
        </View>
      ))}
    </View>
  );
};

export default MedicationsSection;

const useStyle = makeStyles(theme => ({
  container: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeText: {
    color: theme.text[90],
  },
  medCard: {
    backgroundColor: theme.background[70],
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  medLeft: {
    flexShrink: 1,
  },
  medRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  subText: {
    color: theme.text[90],
  },
  daysText: {
    color: theme.primary,
  },
}));
