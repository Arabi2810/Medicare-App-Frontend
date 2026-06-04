import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { PendingTest } from '../../utils/types';
import { PulseSvg } from '@src/utils/icons';
import { UploadFileType } from '../UploadPrescription/UploadPrescription';
import { RootStackParamList } from '@src/navigation/Screens';

interface PendingTestCardProps {
  item: PendingTest;
}

const getValidityConfig = (level: string | null) => {
  switch (level) {
    case 'essential':
      return { color: '#16a34a', bg: '#dcfce7', label: '🟢 Essential' };
    case 'moderate':
      return { color: '#d97706', bg: '#fef9c3', label: '🟡 Moderate' };
    case 'unnecessary':
      return { color: '#dc2626', bg: '#fee2e2', label: '🔴 Unnecessary' };
    default:
      return { color: '#6b7280', bg: '#f3f4f6', label: '⚪ Not Analyzed' };
  }
};

const PendingTestCard: React.FC<PendingTestCardProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);

  const validity = getValidityConfig(item.validityLevel);

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <PulseSvg width={24} height={24} stroke={theme.primary} />
        </View>
        <View style={styles.cardContent}>
          <MediCareText tag="h4" weight="SemiBold" color={theme.text[100]}>
            {item.testName}
          </MediCareText>
          <MediCareText tag="body" color={theme.text[80]} style={{ marginTop: 4 }}>
            Dr. {item.doctorName}
          </MediCareText>
        </View>
        {/* Validity Badge */}
        <View style={[styles.badge, { backgroundColor: validity.bg }]}>
          <MediCareText
            tag="body"
            weight="SemiBold"
            style={{ color: validity.color, fontSize: 11 }}
          >
            {validity.label}
          </MediCareText>
        </View>
      </TouchableOpacity>

      {/* Expandable Details */}
      {expanded && (
        <View style={styles.detailsContainer}>
          {/* What is this test */}
          {item.testDefinition && (
            <View style={styles.section}>
              <MediCareText
                tag="body"
                weight="SemiBold"
                color={theme.text[100]}
                style={styles.sectionTitle}
              >
                📋 What is this test?
              </MediCareText>
              <MediCareText
                tag="body"
                color={theme.text[80]}
                style={styles.sectionText}
              >
                {item.testDefinition}
              </MediCareText>
            </View>
          )}

          {/* Why for this patient */}
          {item.patientRelevance && (
            <View style={styles.section}>
              <MediCareText
                tag="body"
                weight="SemiBold"
                color={theme.text[100]}
                style={styles.sectionTitle}
              >
                👤 Is this test needed for you?
              </MediCareText>
              <MediCareText
                tag="body"
                color={theme.text[80]}
                style={styles.sectionText}
              >
                {item.patientRelevance}
              </MediCareText>
            </View>
          )}

          {/* Validity summary bar */}
          <View style={[styles.validityBar, { backgroundColor: validity.bg, borderColor: validity.color }]}>
            <MediCareText
              tag="body"
              weight="SemiBold"
              style={{ color: validity.color }}
            >
              {item.validityLevel === 'essential' && '✅ You should take this test'}
              {item.validityLevel === 'moderate' && '⚠️ Useful but can be skipped if costly'}
              {item.validityLevel === 'unnecessary' && '❌ This test may not be needed for you'}
              {!item.validityLevel && '⚪ Validity not analyzed'}
            </MediCareText>
          </View>
        </View>
      )}

      {/* Complete Button */}
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() =>
          navigation.navigate('UploadPrescription', {
            type: UploadFileType.Test,
            prescriptionId: item.prescriptionId,
            testId: item.testId,
          })
        }
      >
        <MediCareText tag="body" weight="Medium" color={theme.white}>
          Mark as Completed
        </MediCareText>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.background[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  detailsContainer: {
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: theme.background[50],
    paddingTop: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionText: {
    lineHeight: 22,
  },
  validityBar: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
}));

export default PendingTestCard;