import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText from '@src/components/Text/MediCareText';

const EmptyPendingTests = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <MediCareText tag="h2" style={styles.emoji}>🧪</MediCareText>
      <MediCareText tag="h3" weight="Bold" style={styles.title}>No Pending Tests</MediCareText>
      <MediCareText tag="body" style={styles.subtitle}>
        When your prescription includes lab tests, they will appear here.
      </MediCareText>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { color: theme.text[110], marginBottom: 8, textAlign: 'center' },
  subtitle: { color: theme.text[80], textAlign: 'center', lineHeight: 22 },
}));

export default EmptyPendingTests;