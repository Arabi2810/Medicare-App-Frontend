import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';

export const cancelAllReminderAlarms = async (reminders: any[]) => {
  for (const reminder of reminders) {
    await notifee.cancelNotification(`reminder-${reminder._id}-morning`);
    await notifee.cancelNotification(`reminder-${reminder._id}-noon`);
    await notifee.cancelNotification(`reminder-${reminder._id}-night`);
  }
};

export const scheduleAllReminderAlarms = async (reminders: any[]) => {
  for (const reminder of reminders) {
    if ((reminder as any).status === 'paused') continue;
    const timings = reminder.timings;
    const schedules = reminder.schedules;
    const slots: Array<['morning' | 'noon' | 'night', string | undefined]> = [
      ['morning', timings?.morning],
      ['noon', timings?.noon],
      ['night', timings?.night],
    ];

    for (const [slotName, timeStr] of slots) {
      if (!timeStr) continue;
      if (schedules && schedules[slotName] === false) continue;
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) continue;

      const now = new Date();
      const trigger = new Date(now);
      trigger.setHours(hours, minutes, 0, 0);
      if (trigger.getTime() <= now.getTime()) trigger.setDate(trigger.getDate() + 1);

      try {
        await notifee.createTriggerNotification(
          {
            id: `reminder-${reminder._id}-${slotName}`,
            title: '🕑 Medicine Time',
            body: `${reminder.medicineName} - ${reminder.dosage || 'Take now'}`,
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
      } catch (e) {
        console.warn('Failed to schedule reminder:', reminder._id, slotName, e);
      }
    }
  }
};