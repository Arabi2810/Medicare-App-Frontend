// src/screens/ClinicalSummary/ClinicalSummaryContent.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { makeStyles } from '@src/hooks/makeStyle';

interface ClinicalSummaryContentProps {
  narrative: string;
}

const ClinicalSummaryContent: React.FC<ClinicalSummaryContentProps> = ({ narrative }) => {
  const theme = useTheme();
  const styles = useStyles();

  // Render inline bold (**text**)
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <MediCareText key={i} weight={FontWeight.SemiBold} style={styles.body}>
            {part.slice(2, -2)}
          </MediCareText>
        );
      }
      return part ? (
        <MediCareText key={i} style={styles.body}>
          {part}
        </MediCareText>
      ) : null;
    });
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<View key={`space-${i}`} style={styles.spacer} />);
        i++;
        continue;
      }

      // ## H2
      if (trimmed.startsWith('## ')) {
        elements.push(
          <MediCareText key={i} weight={FontWeight.Bold} style={styles.h2}>
            {trimmed.slice(3)}
          </MediCareText>,
        );
        i++;
        continue;
      }

      // ### H3
      if (trimmed.startsWith('### ')) {
        elements.push(
          <MediCareText key={i} weight={FontWeight.Bold} style={styles.h3}>
            {trimmed.slice(4)}
          </MediCareText>,
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.slice(2);
        elements.push(
          <View key={i} style={styles.listItem}>
            <View style={styles.bulletDot} />
            <View style={styles.bulletContent}>
              {renderInline(content)}
            </View>
          </View>,
        );
        i++;
        continue;
      }

      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        elements.push(
          <View key={i} style={styles.listItem}>
            <MediCareText weight={FontWeight.SemiBold} style={styles.numberedIndex}>
              {numberedMatch[1]}.
            </MediCareText>
            <View style={styles.bulletContent}>
              {renderInline(numberedMatch[2])}
            </View>
          </View>,
        );
        i++;
        continue;
      }

      elements.push(
        <MediCareText key={i} style={styles.paragraph}>
          {renderInline(trimmed)}
        </MediCareText>,
      );
      i++;
    }

    return elements;
  };

  return <View style={styles.card}>{renderMarkdown(narrative)}</View>;
};

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.border[80],
  },
 h2: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  h3: {
    fontSize: 15,
    lineHeight: 20,
    color: theme.text[110],
    marginTop: 14,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.text[110],
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.text[110],
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.primary,
    marginTop: 8,
    marginRight: 10,
    flexShrink: 0,
  },
  numberedIndex: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.primary,
    marginRight: 8,
    flexShrink: 0,
    minWidth: 20,
  },
  bulletContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  spacer: {
    height: 6,
  },
}));

export default ClinicalSummaryContent;