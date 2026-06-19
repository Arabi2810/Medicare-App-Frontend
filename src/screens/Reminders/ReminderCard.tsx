import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import NotificationIcon from '../../assets/icons/notification.svg';
import ClockIcon from '../../assets/icons/clock.svg';
import { MedicineItem } from '@src/utils/types';
import { useUpdateReminderMutation } from '@src/redux/pescription/pescription';
import MediCareInput from '@src/components/Input/MediCareInput';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { useToast } from '@src/components/Toast/ToastProvider';

interface Props {
  item: MedicineItem;
}

const ReminderCard: React.FC<Props> = ({ item }) => {
  const theme = useTheme();
  const styles = useStyle();
  const [showEdit, setShowEdit] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const initialEnabled = (item as any)?.status !== 'paused';
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [updateReminder, { isLoading }] = useUpdateReminderMutation();
  const { showToast } = useToast();

  const [timings, setTimings] = useState({
    morning: item.timings?.morning || '08:00',
    noon: item.timings?.noon || '13:00',
    night: item.timings?.night || '20:00',
  });

  const [dosage, setDosage] = useState(item.dosage || '');

  const displayTime = timings.morning || timings.noon || timings.night || 'N/A';

  const handleToggle = async (value: boolean) => {
    setIsEnabled(value);
    try {
      await updateReminder({
        reminderId: item._id,
        data: { status: value ? 'active' : 'paused' },
      }).unwrap();
    } catch (error) {
      setIsEnabled(!value);
      Alert.alert('Error', 'Failed to update reminder status');
      return;
    }
    try {
      if (!value) {
        await notifee.cancelNotification(`reminder-${item._id}-morning`);
        await notifee.cancelNotification(`reminder-${item._id}-noon`);
        await notifee.cancelNotification(`reminder-${item._id}-night`);
      } else {
        const slots: Array<['morning' | 'noon' | 'night', string | undefined]> = [
          ['morning', timings?.morning],
          ['noon', timings?.noon],
          ['night', timings?.night],
        ];

        for (const [slotName, timeStr] of slots) {
          if (!timeStr) continue;
          if ((item as any).schedules && (item as any).schedules[slotName] === false) continue;
          const [hours, minutes] = timeStr.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) continue;

          const now = new Date();
          const trigger = new Date(now);
          trigger.setHours(hours, minutes, 0, 0);
          if (trigger.getTime() <= now.getTime()) trigger.setDate(trigger.getDate() + 1);

          await notifee.createTriggerNotification(
            {
              id: `reminder-${item._id}-${slotName}`,
              title: '🕑 Medicine Time',
              body: `${item.medicineName} - ${dosage || 'Take now'}`,
              android: {
                channelId: 'alarm_channel',
                sound: 'alarm_sound',
                importance: 4,
                pressAction: { id: 'default' },
                loopSound: true,
                vibrationPattern: [500, 500, 500],
              },
            },
            {
              type: TriggerType.TIMESTAMP,
              timestamp: trigger.getTime(),
              repeatFrequency: RepeatFrequency.DAILY,
              alarmManager: { allowWhileIdle: true },
            },
          );
        }
      }
    } catch (notifErr) {
      console.warn('Notification scheduling failed:', notifErr);
    }
  };


const handleSave = async () => {
  let saveSucceeded = false;
  try {
    await updateReminder({
      reminderId: item._id,
      data: { timings, dosage },
    }).unwrap();
    saveSucceeded = true;
  } catch (error) {
    showToast('Failed to update reminder', 'error');
    return;
  }

  // Reschedule alarms in a SEPARATE try/catch so it can't override the save success
  try {
    await notifee.cancelNotification(`reminder-${item._id}-morning`);
    await notifee.cancelNotification(`reminder-${item._id}-noon`);
    await notifee.cancelNotification(`reminder-${item._id}-night`);

    const slots: Array<['morning' | 'noon' | 'night', string | undefined]> = [
      ['morning', timings?.morning],
      ['noon', timings?.noon],
      ['night', timings?.night],
    ];

    for (const [slotName, timeStr] of slots) {
      if (!timeStr) continue;
      if (item.schedules && item.schedules[slotName] === false) continue;
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) continue;

      const now = new Date();
      const trigger = new Date(now);
      trigger.setHours(hours, minutes, 0, 0);
      if (trigger.getTime() <= now.getTime()) trigger.setDate(trigger.getDate() + 1);

      await notifee.createTriggerNotification(
        {
          id: `reminder-${item._id}-${slotName}`,
          title: '🕑 Medicine Time',
          body: `${item.medicineName} - ${dosage || 'Take now'}`,
          android: {
            channelId: 'alarm_channel',
            sound: 'alarm_sound',
            importance: 4,
            pressAction: { id: 'default' },
            loopSound: true,
            vibrationPattern: [500, 500, 500],
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: trigger.getTime(),
          repeatFrequency: RepeatFrequency.DAILY,
          alarmManager: { allowWhileIdle: true },
        },
      );
    }
    console.log(`✅ Alarms rescheduled for reminder ${item._id}`);
  } catch (e) {
    console.warn('Alarm reschedule failed:', e);
  }

  showToast('Reminder updated successfully', 'success');
  setShowEdit(false);
};
  const showThreeDotMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [isEnabled ? 'Turn Off' : 'Turn On', 'Edit Time', 'Cancel'],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) handleToggle(!isEnabled);
          else if (buttonIndex === 1) setShowEdit(true);
        }
      );
    } else {
      setShowMenu(true);
    }
  };

  return (
    <>
      <View style={[styles.reminderCard, !isEnabled && styles.reminderCardPaused]}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderTimeContainer}>
            <View style={styles.clockIconBg}>
              <ClockIcon width={20} height={20} color={theme.primary} />
            </View>
            <View style={styles.reminderDetails}>
              <MediCareText tag="h3" weight="Bold" color={isEnabled ? theme.black : theme.text[100]}>
                {displayTime}
              </MediCareText>
              <MediCareText tag="body" color={theme.text[100]}>
                {`${item.medicineName} ${dosage}`}
              </MediCareText>
            </View>
          </View>

          <View style={styles.rightActions}>
            <Switch
              value={isEnabled}
              onValueChange={handleToggle}
              trackColor={{ false: theme.border[80], true: theme.primary + '55' }}
              thumbColor={isEnabled ? theme.primary : theme.text[100]}
              style={styles.toggle}
            />
            <TouchableOpacity onPress={showThreeDotMenu} style={styles.menuBtn}>
              <MediCareText tag="h3" color={theme.text[100]}>⋮</MediCareText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reminderFooter}>
          <NotificationIcon
            width={14}
            height={14}
            color={isEnabled ? theme.text[100] : theme.border[80]}
          />
          <MediCareText
            tag="body2"
            color={isEnabled ? theme.text[100] : theme.border[80]}
            style={styles.footerText}
          >
            {isEnabled ? 'Sound + Notification enabled' : 'Reminder paused'}
          </MediCareText>
        </View>
      </View>

      {/* Android three dot menu */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowMenu(false)} activeOpacity={1}>
          <View style={styles.menuCard}>
            <MediCareText tag="body" weight="SemiBold" color={theme.text[100]} style={styles.menuMedicineName}>
              {item.medicineName}
            </MediCareText>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); handleToggle(!isEnabled); }}>
              <MediCareText tag="body" color={theme.black}>
                {isEnabled ? '🔕 Turn Off' : '🔔 Turn On'}
              </MediCareText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); setShowEdit(true); }}>
              <MediCareText tag="body" color={theme.black}>✏️ Edit Time</MediCareText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Time Modal */}
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
                const slot = item.timings?.morning ? 'morning' : item.timings?.noon ? 'noon' : 'night';
                setTimings(prev => ({ ...prev, [slot]: text }));
              }}
              placeholder="09:15"
              containerStyle={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEdit(false)}>
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


const getNextTriggerTime = (hours: number, minutes: number): number => {
  const now = new Date();
  const trigger = new Date(now);
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
  reminderCardPaused: {
    opacity: 0.6,
    backgroundColor: theme.background[70],
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTimeContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
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
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  toggle: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
  menuBtn: { padding: 6, marginLeft: 2 },
  reminderFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  footerText: { marginLeft: 6 },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCard: {
    backgroundColor: theme.white,
    borderRadius: 16,
    paddingVertical: 8,
    width: 220,
    elevation: 8,
  },
  menuMedicineName: { paddingHorizontal: 16, paddingVertical: 10 },
  menuDivider: { height: 1, backgroundColor: theme.border[80], marginBottom: 4 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 14 },
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