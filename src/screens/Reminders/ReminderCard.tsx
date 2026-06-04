import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import NotificationIcon from '../../assets/icons/notification.svg';
import ClockIcon from '../../assets/icons/clock.svg';
import { MedicineItem } from '@src/utils/types';
import { useUpdateReminderMutation } from '@src/redux/pescription/pescription';
import MediCareInput from '@src/components/Input/MediCareInput';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import notifee, { TriggerType } from '@notifee/react-native';

interface Props {
  item: MedicineItem;
}

const ReminderCard: React.FC<Props> = ({ item }) => {
  const theme = useTheme();
  const styles = useStyle();
  const [showEdit, setShowEdit] = useState(false);
  const [updateReminder, { isLoading }] = useUpdateReminderMutation();

  const [timings, setTimings] = useState({
    morning: item.timings?.morning || '08:00',
    noon: item.timings?.noon || '13:00',
    night: item.timings?.night || '20:00',
  });

  const [dosage, setDosage] = useState(item.dosage || '');

  const displayTime = timings.morning || timings.noon || timings.night || 'N/A';

  const handleSave = async () => {
    try {
      await updateReminder({
        reminderId: item._id,
        data: { timings, dosage },
      }).unwrap();

      // Cancel old notification
      await notifee.cancelNotification(`reminder-${item._id}`);

      // Schedule new alarm
      await scheduleAlarmNotification(item, timings);

      Alert.alert('Success', 'Reminder updated with alarm sound');
      setShowEdit(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update reminder');
    }
  };

  return (
    <>
      <View style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderTimeContainer}>
            <View style={styles.clockIconBg}>
              <ClockIcon width={20} height={20} color={theme.primary} />
            </View>
            <View style={styles.reminderDetails}>
              <MediCareText tag="h3" weight="Bold" color={theme.black}>
                {displayTime}
              </MediCareText>
              <MediCareText tag="body" color={theme.text[100]}>
                {`${item.medicineName} ${dosage}`}
              </MediCareText>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowEdit(true)} style={styles.editBtn}>
            <MediCareText tag="body" color={theme.primary}>✏️</MediCareText>
          </TouchableOpacity>
        </View>

        <View style={styles.reminderFooter}>
          <NotificationIcon width={14} height={14} color={theme.text[100]} />
          <MediCareText tag="body2" color={theme.text[100]} style={styles.footerText}>
            Sound + Notification enabled
          </MediCareText>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={showEdit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MediCareText tag="h3" weight="Bold" color={theme.text[110]} style={styles.modalTitle}>
              Edit Reminder
            </MediCareText>

            <MediCareText tag="body" weight="SemiBold" color={theme.text[110]} style={styles.label}>
              {item.medicineName}
            </MediCareText>

            <MediCareInput
              label="Dosage"
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g. 1 tablet"
              containerStyle={styles.input}
            />

            <MediCareText tag="body" weight="SemiBold" color={theme.text[110]} style={styles.label}>
              Time (24-hour format)
            </MediCareText>
            <MediCareInput
              value={timings.morning || timings.noon || timings.night || ''}
              onChangeText={(text) => {
                setTimings({ morning: text, noon: '', night: '' });
              }}
              placeholder="09:15"
              containerStyle={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEdit(false)}
              >
                <MediCareText tag="body" color={theme.text[90]}>Cancel</MediCareText>
              </TouchableOpacity>
              <MediCareButton
                title={isLoading ? 'Saving...' : 'Save'}
                type={ButtonType.Primary}
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

/* ==================== ALARM NOTIFICATION ==================== */
const scheduleAlarmNotification = async (reminder: any, timings: any) => {
  const timeStr = timings.morning || timings.noon || timings.night;
  if (!timeStr) return;

  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return;

  const triggerTime = getNextTriggerTime(hours, minutes);

  await notifee.createTriggerNotification(
    {
      id: `reminder-${reminder._id}`,
      title: `🕒 Medicine Time`,
      body: `${reminder.medicineName} - ${reminder.dosage || 'Take now'}`,
      android: {
        channelId: 'alarm_channel',
        sound: 'alarm_sound',
        importance: 4,
        pressAction: { id: 'default' },
        fullScreenIntent: true,        // Important for alarm behavior
        loopSound: true,
        vibrationPattern: [500, 500, 500],
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTime,
    }
  );
};

const getNextTriggerTime = (hours: number, minutes: number): number => {
  const now = new Date();
  let trigger = new Date(now);
  trigger.setHours(hours, minutes, 0, 0);

  if (trigger.getTime() <= now.getTime()) {
    trigger.setDate(trigger.getDate() + 1);
  }
  return trigger.getTime();
};

const useStyle = makeStyles(theme => ({
  reminderCard: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTimeContainer: { flexDirection: 'row', alignItems: 'center' },
  clockIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderDetails: { justifyContent: 'center' },
  editBtn: { padding: 6 },
  reminderFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  footerText: { marginLeft: 6 },
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
  modalTitle: { marginBottom: 16 },
  label: { marginBottom: 8 },
  input: { marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border[80],
  },
  saveBtn: { flex: 1 },
}));

export default ReminderCard;