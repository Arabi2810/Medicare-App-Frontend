import { View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';

interface Test {
  name: string;
  status?: string;
  completedDate?: string | null;
}

interface Props {
  tests: Test[];
}

const Tests: React.FC<Props> = ({ tests }) => {
  const theme = useTheme();
  const styles = useStyle();

  if (!tests || tests.length === 0) return null;

  const isCompleted = (test: Test) =>
    test.status?.toLowerCase() === 'completed' || !!test.completedDate;

  return (
    <View style={styles.card}>
      <MediCareText tag="h3" weight="Bold" color={theme.black} style={styles.cardTitle}>
        Prescribed Tests
      </MediCareText>
      {tests.map((test, index) => {
        const completed = isCompleted(test);
        return (
          <View key={index} style={styles.testCard}>
            <MediCareText tag="body" weight="SemiBold" color={theme.black} style={{ flex: 1 }}>
              {test.name}
            </MediCareText>
            <View style={completed ? styles.completedBadge : styles.pendingBadge}>
              <MediCareText
                tag="body2"
                color={completed ? (theme.green?.[800] || '#166534') : (theme.yellow[800] || '#854D0E')}
              >
                {completed ? 'Completed' : 'Pending'}
              </MediCareText>
            </View>
          </View>
        );
      })}
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
  completedBadge: {
    backgroundColor: theme.green?.[100] || '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
}));

export default Tests;