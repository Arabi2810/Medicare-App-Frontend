import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';

interface SectionHeaderProps {
  title: string;
  icon?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {icon && <MediCareText style={styles.icon}>{icon}</MediCareText>}
      <MediCareText tag="h4" weight={FontWeight.SemiBold} style={styles.title}>
        {title}
      </MediCareText>
    </View>
  );
};

export default SectionHeader;

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    color: theme.text[110],
  },
}));
