import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { makeStyles } from '@src/hooks/makeStyle';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const styles = useStyle();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.text[110]} style={styles.title}>
            {title}
          </MediCareText>
          <MediCareText tag="body" color={theme.text[90]} style={styles.message}>
            {message}
          </MediCareText>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, { borderColor: theme.border[80], borderWidth: 1 }]}
              onPress={onCancel}
              disabled={loading}
            >
              <MediCareText tag="body" color={theme.text[90]}>
                {cancelLabel}
              </MediCareText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: destructive ? '#EF4444' : theme.colors.primary },
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.white}>
                {loading ? 'Please wait...' : confirmLabel}
              </MediCareText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const useStyle = makeStyles(theme => ({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: { marginBottom: 12 },
  message: { marginBottom: 20, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
}));

export default ConfirmModal;