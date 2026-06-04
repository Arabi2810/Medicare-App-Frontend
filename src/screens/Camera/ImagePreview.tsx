import { View, Image, Pressable } from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CloseSvg } from '@src/utils/icons';
import MediCareButton, {
  ButtonType,
} from '@src/components/Button/MediCareButton';
import { useNavigation } from '@react-navigation/native';
import { uploadToCloudinary } from '@src/utils/cloudinaryUpload';
import { useUploadFileMutation } from '@src/redux/features/files/uploadFile';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@src/navigation/Screens';
import { useAppSelector } from '@src/redux/store';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

interface Props {
  capturedPhoto: string;
  setCapturedPhoto: Dispatch<SetStateAction<string | undefined>>;
}

const ImagePreview: React.FC<Props> = ({ capturedPhoto, setCapturedPhoto }) => {
  const navigation = useNavigation();
  const styles = useStyle();
  const navigation2 = useNavigation<NavigationProp<RootStackParamList>>();
  const [uploadFile] = useUploadFileMutation();
  const [isUploading, setIsUploading] = useState(false);
  const userId = useAppSelector(state => state.auth.user?.id) || 'unknown';

  const handleClosePreview = () => {
    setCapturedPhoto(undefined);
  };

  const handleNext = async () => {
    try {
      setIsUploading(true);
      const { secure_url } = await uploadToCloudinary(
        capturedPhoto,
        `prescriptions/${userId}`
      );
      const formData = new FormData();
      formData.append('cloudinaryUrl', secure_url);
      const response = await uploadFile(formData).unwrap();
      if ('data' in response) {
        navigation2.navigate('FormScreen', { data: response.data });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
      <SafeAreaView style={styles.previewControls} edges={['top', 'bottom']}>
        <Pressable style={styles.closeButton} onPress={handleClosePreview}>
          <CloseSvg width={24} height={24} stroke="#FFFFFF" />
        </Pressable>
        <View style={styles.previewButtons}>
          <MediCareButton
            type={ButtonType.Secondary}
            title="Close"
            onPress={handleClosePreview}
            style={[styles.previewButton, { marginRight: 8 }]}
          />
          <MediCareButton
            type={ButtonType.Primary}
            title={isUploading ? 'Uploading...' : 'Next'}
            onPress={handleNext}
            style={[styles.previewButton, { marginLeft: 8 }]}
            disabled={isUploading}
            isLoading={isUploading}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ImagePreview;

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.black,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  previewControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 20,
  },
  previewButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  previewButton: {
    flex: 1,
  },
}));
