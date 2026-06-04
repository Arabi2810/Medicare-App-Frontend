import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';

interface Props {
  title: string;
  subtitle: string;
  Icon: React.ComponentType<any>;
  onPress?: () => void;
}

const ActionTile: React.FC<Props> = ({ title, subtitle, Icon, onPress }) => {
  const styles = useStyle();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={1}>
      <View style={styles.iconWrap}>
        <Icon
          stroke={styles.iconStroke.color as string}
          height={20}
          width={20}
        />
      </View>
      <MediCareText tag="h4" weight={FontWeight.SemiBold} style={styles.title}>
        {title}
      </MediCareText>
      <MediCareText
        tag="body2"
        weight={FontWeight.Regular}
        color={styles.subText.color as string}
      >
        {subtitle}
      </MediCareText>
    </TouchableOpacity>
  );
};

export default ActionTile;

const useStyle = makeStyles(theme => ({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flex: 1,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrap: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: theme.background[110],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconStroke: {
    color: theme.primary,
  },
  title: {
    marginBottom: 4,
  },
  subText: {
    color: theme.text[90],
  },
}));
