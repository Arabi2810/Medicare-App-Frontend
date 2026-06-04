import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { CloseSvg } from '@src/utils/icons';
import { UploadFileType } from '../UploadPrescription';

interface Props {
  onClose: () => void;
  type: UploadFileType;
}

const ScreenHeader: React.FC<Props> = ({ onClose, type }) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <CloseSvg
          stroke={styles.closeIconStroke.color as string}
          height={24}
          width={24}
        />
      </TouchableOpacity>
      <MediCareText tag="h2" weight={FontWeight.Bold} style={styles.title}>
        {`Upload ${type}`}
      </MediCareText>
    </View>
  );
};

export default ScreenHeader;

const useStyle = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[90],
  },
  closeButton: {
    marginRight: 16,
  },
  closeIconStroke: {
    color: theme.black,
  },
  title: {
    flex: 1,
  },
}));
