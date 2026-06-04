import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { ClockSvg, NotificationSvg } from '@src/utils/icons';

interface ReminderItem {
  id: string;
  title: string; // e.g., Napa 500mg
  time: string; // e.g., 09:00 AM
}

interface Props {
  title?: string;
  items: ReminderItem[];
}

const NextRemindersSection: React.FC<Props> = ({
  title = 'Next Reminders',
  items,
}) => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MediCareText tag="h3" weight={FontWeight.SemiBold}>
          {title}
        </MediCareText>
        <ClockSvg stroke={styles.clockStroke.color as string} height={18} width={18} />
      </View>

      {items.map(item => (
        <View key={item.id} style={styles.row}>
          <View style={styles.bullet}>
            <NotificationSvg stroke={styles.bulletStroke.color as string} height={16} width={16} />
          </View>
          <View style={styles.texts}>
            <MediCareText tag="body" weight={FontWeight.Medium}>
              {item.title}
            </MediCareText>
            <MediCareText tag="body2" color={styles.subText.color as string}>
              {item.time}
            </MediCareText>
          </View>
        </View>
      ))}
    </View>
  );
};

export default NextRemindersSection;

const useStyle = makeStyles(theme => ({
  container: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bullet: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: theme.background[110],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bulletStroke: {
    color: theme.primary,
  },
  texts: {
    flexDirection: 'column',
  },
  subText: {
    color: theme.text[90],
  },
  clockStroke: {
    color: theme.text[90],
  },
}));


