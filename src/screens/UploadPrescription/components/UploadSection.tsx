import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import { CameraSvg } from '@src/utils/icons';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareButton, {
  ButtonType,
} from '@src/components/Button/MediCareButton';
import { UploadFileType } from '../UploadPrescription';

interface Props {
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
  type: UploadFileType;
}

const UploadSection: React.FC<Props> = ({
  onTakePhoto,
  onChooseFromGallery,
  type,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <CameraSvg
          stroke={styles.iconStroke.color as string}
          height={48}
          width={48}
        />
      </View>
      <MediCareText tag="h3" weight={FontWeight.Bold} style={styles.heading}>
        Take a Photo or Upload
      </MediCareText>
      {type === UploadFileType.Prescription && (
        <MediCareText
          tag="body"
          weight={FontWeight.Regular}
          color={styles.descriptionText.color as string}
          style={styles.description}
        >
          Our AI will extract medicine details automatically.
        </MediCareText>
      )}
      <View style={styles.buttonContainer}>
        <MediCareButton
          title="Take Photo"
          type={ButtonType.Primary}
          style={styles.takePhotoButton}
          onPress={onTakePhoto}
        />
        <MediCareButton
          title="Choose from Gallery"
          type={ButtonType.Secondary}
          style={styles.galleryButton}
          onPress={onChooseFromGallery}
        />
      </View>
    </View>
  );
};

export default UploadSection;

const useStyle = makeStyles(theme => ({
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: theme.background[70],
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconStroke: {
    color: theme.primary,
  },
  heading: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
  },
  descriptionText: {
    color: theme.text[90],
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  takePhotoButton: {
    width: '100%',
  },
  galleryButton: {
    width: '100%',
  },
}));
