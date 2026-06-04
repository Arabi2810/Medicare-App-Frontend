/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { View, ActivityIndicator, Image, Button } from 'react-native';
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
  if (hasGalleryPermission) {
    try {
      const result = await pick({
        type: [types.images],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        setIsUploading(true);
        await new Promise(resolve => setTimeout(() => resolve(undefined), 50));
        const fileUri = result[0].uri;
        const fileName = result[0].name || 'prescription.jpg';

        if (type === UploadFileType.Prescription) {
          // Upload to Cloudinary first
          const { secure_url } = await uploadToCloudinary(
            fileUri,
            `prescriptions/${userId}`
          );

          // Send Cloudinary URL to backend
          const formData = new FormData();
          formData.append('cloudinaryUrl', secure_url);
          const response = await uploadFile(formData).unwrap();

          if ('data' in response) {
            navigation.navigate('FormScreen', { data: response.data });
          } else {
            throw response.error;
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
      }
    } catch (error) {
      showError(error);
    } finally {
      setIsUploading(false);
    }
  }
};

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
      {(isLoading || isUploading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
