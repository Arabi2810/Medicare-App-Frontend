import {
  View,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MediCareText, { FontWeight } from '../../../components/Text/MediCareText';
import { makeStyles } from '../../../hooks/makeStyle';
import { RootStackParamList } from '../../../navigation/Screens';
import {
  useGetPrescriptionDetailsQuery,
  useDeletePrescriptionMutation,
} from '../../../redux/pescription/pescription';
import Header from './components/Header';
import PatientInfo from './components/PatientInfo';
import Medicines from './components/Medicines';
import MediCareButton from '../../../components/Button/MediCareButton';
import DiagnosisSymptoms from './components/DiagnosisSymptoms';
import { Prescription } from '@src/utils/types';
import Tests from './components/Tests';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoryDetails'>;

const HistoryDetails: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useStyle();

  const { data, isLoading, error } = useGetPrescriptionDetailsQuery(id);
  const prescription: Prescription = data?.data?.prescription;
  const [showImage, setShowImage] = useState(false);

  const [deletePrescription, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Prescription',
      'Are you sure you want to delete this prescription? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePrescription(id).unwrap();
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete prescription');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    // Navigate to edit screen — adjust route name to match your navigation
    navigation.navigate('FormScreen', { data: prescription });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !prescription) {
    return (
      <View style={[styles.container, styles.center]}>
        <MediCareText color={theme.error[100]}>
          Failed to load prescription details.
        </MediCareText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <MediCareText color={theme.primary}>Go Back</MediCareText>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompleted = prescription.isComplete;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          insets={insets}
          doctor={prescription.doctor}
          isComplete={prescription.isComplete}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.contentContainer}>

          {prescription.imageUrl && (
            <TouchableOpacity
              style={styles.viewOriginalButton}
              onPress={() => setShowImage(!showImage)}
            >
              <MediCareText tag="body" weight={FontWeight.Medium} color={theme.primary}>
                {showImage ? '▲ Hide Original Prescription' : '📄 View Original Prescription'}
              </MediCareText>
            </TouchableOpacity>
          )}

          {showImage && prescription.imageUrl && (
            <Image
              source={{ uri: prescription.imageUrl }}
              style={styles.prescriptionImage}
              resizeMode="contain"
            />
          )}

          <PatientInfo
            patient={{
              name: prescription?.patient?.name || undefined,
              age: prescription?.patient?.age || undefined,
              gender: prescription?.patient?.gender || undefined,
            }}
            date={formatDate(prescription?.uploadedAt)}
          />

          <DiagnosisSymptoms
            symptoms={prescription.symptoms}
            diagnosis={prescription.diagnosis}
          />

          <Medicines medicines={prescription.medicines} />
          {prescription.tests && prescription.tests.length > 0 && (
            <Tests tests={prescription.tests.map((t: any) => ({ name: t.name }))} />
          )}
          {/* Bottom action area */}
          <View style={styles.bottomActions}>

            {/* Edit + Delete icon buttons — only shown when NOT completed */}
            {!isCompleted && (
              <View style={styles.iconButtonRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={handleEdit}
                >
                  <MediCareText tag="body" style={styles.iconBtnIcon}>✏️</MediCareText>
                  <MediCareText tag="body2" color={theme.primary} weight="SemiBold">
                    Edit
                  </MediCareText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconBtn, styles.iconBtnDanger]}
                  onPress={handleDelete}
                  disabled={isDeleting}
                >
                  <MediCareText tag="body" style={styles.iconBtnIcon}>🗑️</MediCareText>
                  <MediCareText tag="body2" color="#EF4444" weight="SemiBold">
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </MediCareText>
                </TouchableOpacity>
              </View>
            )}

            {/* Complete Prescription bar — only when not completed */}
            {!isCompleted && (
              <MediCareButton
                title="Complete Prescription"
                onPress={() =>
                  navigation.navigate('CompleteHistory', {
                    prescriptionId: id,
                    userId: prescription.userId,
                  })
                }
                style={styles.completeBtn}
              />
            )}

            {/* If completed — only show delete */}
            {isCompleted && (
              <TouchableOpacity
                style={styles.deleteOnlyBtn}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <MediCareText tag="body" style={styles.iconBtnIcon}>🗑️</MediCareText>
                <MediCareText tag="body" color="#EF4444" weight="SemiBold">
                  {isDeleting ? 'Deleting...' : 'Delete Prescription'}
                </MediCareText>
              </TouchableOpacity>
            )}

          </View>
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    marginTop: -40,
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
  },
  viewOriginalButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  prescriptionImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
  },

  // Bottom actions
  bottomActions: {
    marginTop: 20,
    gap: 12,
  },
  iconButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.primary,
    backgroundColor: theme.white,
  },
  iconBtnDanger: {
    borderColor: '#EF4444',
  },
  iconBtnIcon: {
    fontSize: 16,
  },
  completeBtn: {
    borderRadius: 12,
  },
  deleteOnlyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    backgroundColor: theme.white,
  },
}));

export default HistoryDetails;