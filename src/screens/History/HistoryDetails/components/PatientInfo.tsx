import { View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';

interface Props {
  patient: {
    name?: string;
    age?: string | number;
    gender?: string | null;
  };
  date: string;
}

const PatientInfo: React.FC<Props> = ({ patient, date }) => {
  const theme = useTheme();
  const styles = useStyle();

  return (
    <View style={styles.card}>
      <MediCareText
        tag="h3"
        weight="Bold"
        color={theme.black}
        style={styles.cardTitle}
      >
        Patient Information
      </MediCareText>

      <View style={styles.patientGrid}>
        <View style={styles.patientGridItem}>
          <MediCareText tag="body2" color={theme.text[80]}>
            Name
          </MediCareText>
          <MediCareText tag="body" weight="Bold" color={theme.black}>
            {patient?.name || 'N/A'}
          </MediCareText>
        </View>
        <View style={styles.patientGridItem}>
          <MediCareText tag="body2" color={theme.text[80]}>
            Age
          </MediCareText>
          <MediCareText tag="body" weight="Bold" color={theme.black}>
            {patient?.age || 'N/A'}
          </MediCareText>
        </View>
        <View style={styles.patientGridItem}>
          <MediCareText tag="body2" color={theme.text[80]}>
            Gender
          </MediCareText>
          <MediCareText tag="body" weight="Bold" color={theme.black}>
            {patient?.gender === 'M'
              ? 'Male'
              : patient?.gender === 'F'
              ? 'Female'
              : patient?.gender
              ? patient.gender
              : 'N/A'}
          </MediCareText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={{ marginTop: 12 }}>
        <MediCareText tag="body2" color={theme.text[80]}>
          Prescription Date
        </MediCareText>
        <MediCareText tag="body" weight="Bold" color={theme.black}>
          {date}
        </MediCareText>
      </View>
    </View>
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 16,
  },
  patientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientGridItem: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border[80],
    marginVertical: 16,
  },
}));

export default PatientInfo;
