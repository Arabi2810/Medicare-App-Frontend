import { View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';

interface Test {
  name: string;
}

interface Props {
  tests: Test[];
}

const Tests: React.FC<Props> = ({ tests }) => {
  const theme = useTheme();
  const styles = useStyle();

  if (!tests || tests.length === 0) return null;

  return (
    <View style={styles.card}>
      <MediCareText tag="h3" weight="Bold" color={theme.black} style={styles.cardTitle}>
        Prescribed Tests
      </MediCareText>
      {tests.map((test, index) => (
        <View key={index} style={styles.testCard}>
          <MediCareText tag="body" weight="SemiBold" color={theme.black} style={{ flex: 1 }}>
            {test.name}
          </MediCareText>
          <View style={styles.pendingBadge}>
            <MediCareText tag="body2" color={theme.yellow[800] || '#854D0E'}>
              pending
            </MediCareText>
          </View>
        </View>
      ))}
    </View>
  );
};

const useStyle = makeStyles(theme => ({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { marginBottom: 16 },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.background[90],
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  pendingBadge: {
    backgroundColor: theme.yellow[100] || '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
}));

export default Tests;