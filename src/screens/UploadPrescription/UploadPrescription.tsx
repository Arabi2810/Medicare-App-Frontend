/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@src/navigation/Screens';
import ScreenHeader from './components/ScreenHeader';
import UploadSection from './components/UploadSection';
import TipsSection from './components/TipsSection';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePermission from '@src/hooks/usePermission';
import { types, pick } from '@react-native-documents/picker';
import { useUploadFileMutation } from '@src/redux/features/files/uploadFile';
import { showError } from '@src/helper/alert';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { uploadToCloudinary } from '@src/utils/cloudinaryUpload';
import { useAppSelector } from '@src/redux/store';

export enum UploadFileType {
  Prescription = 'Prescription',
  Test = 'Test Report',
}

const UploadPrescription: React.FC<
  NativeStackScreenProps<RootStackParamList, 'UploadPrescription'>
> = ({ route }) => {
  const { type, prescriptionId, testId } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { cameraPermission, galleryPermission } = usePermission();
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing your prescription...');
  const styles = useStyle();
  const userId = useAppSelector(state => state.auth.user?.id) || 'unknown';

  const handleClose = () => {
    navigation.goBack();
  };


  const handleTakePhoto = async () => {
    const hasCameraPermission = await cameraPermission();
    if (hasCameraPermission) {
      navigation.navigate('CameraScreen');
    }
  };

  const handleChooseFromGallery = async () => {
    const hasGalleryPermission = await galleryPermission();
    if (!hasGalleryPermission) return;

    try {
      const result = await pick({
        type: [types.images],
        allowMultiSelection: false,
      });

      if (!result || result.length === 0) return;

      setIsUploading(true);

      // Small delay so loading overlay renders before heavy work starts
      await new Promise<void>(resolve => setTimeout(resolve, 50));

      const fileUri = result[0].uri;
      const fileName = result[0].name || 'prescription.jpg';

      if (type === UploadFileType.Prescription) {
        let secure_url: string;
        try {
          const cloudinaryResult = await uploadToCloudinary(
            fileUri,
            `prescriptions/${userId}`
          );
          secure_url = cloudinaryResult.secure_url;
        } catch (uploadError: any) {
          throw new Error(
            'Image upload failed. Please check your connection and try again.'
          );
        }

        const formData = new FormData();
        formData.append('cloudinaryUrl', secure_url);

        let response: any;
        try {
          response = await uploadFile(formData).unwrap();
        } catch (backendError: any) {
          const message =
            backendError?.data?.message ||
            backendError?.data?.error ||
            backendError?.message ||
            'Failed to process prescription. Please try again.';
          throw new Error(message);
        }

        // Step 3: Navigate to form with parsed data
        if (response && 'data' in response) {
          navigation.navigate('FormScreen', { data: response.data });
        } else if (response) {
          // Some backends return the data directly
          navigation.navigate('FormScreen', { data: response });
        } else {
          throw new Error('No data received from server. Please try again.');
        }

      } else if (type === UploadFileType.Test && prescriptionId && testId) {
        navigation.navigate('PendingTestForm', {
          prescriptionId,
          testId,
          file: {
            uri: fileUri,
            type: result[0].type,
            name: fileName,
          },
        });
      }

    } catch (error: any) {
      if (error?.message) {
        showError({ message: error.message });
      } else {
        showError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isLoading || isUploading;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader onClose={handleClose} type={type} />
      <View style={styles.content}>
        <UploadSection
          onTakePhoto={handleTakePhoto}
          onChooseFromGallery={handleChooseFromGallery}
          type={type}
        />
        <TipsSection type={type} />
      </View>

      {isBusy && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
            <Text style={styles.loadingSubText}>
              This may take up to 30 seconds
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default UploadPrescription;

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 260,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
}));