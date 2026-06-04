import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { CloseSvg, TickSvg } from '@src/utils/icons';

interface HeaderProps {
  onClose?: () => void;
  onSave?: () => void;
  title?: string;
  isLoading?: boolean;
}

const PrescriptionHeader: React.FC<HeaderProps> = ({
  onClose,
  onSave,
  title = 'Prescription Details',
  isLoading,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <CloseSvg />
      </TouchableOpacity>
      <MediCareText tag="h3" weight={FontWeight.SemiBold}>
        {title}
      </MediCareText>
      {isLoading ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <TouchableOpacity onPress={onSave}>
          <TickSvg />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PrescriptionHeader;

const useStyles = makeStyles(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[90],
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    color: theme.primary,
  },
}));
