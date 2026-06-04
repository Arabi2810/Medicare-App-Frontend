import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { UploadFileType } from '../UploadPrescription';

interface TipItem {
  text: string;
}

interface Props {
  type: UploadFileType;
}

const TipsSection: React.FC<Props> = ({ type }) => {
  const styles = useStyle();

  const tips: TipItem[] = [
    { text: 'Ensure good lighting' },
    { text: `Keep ${type.toLocaleLowerCase()} flat and visible` },
    { text: 'Avoid shadows and blur' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MediCareText
            tag="body"
            weight={FontWeight.Bold}
            color={styles.iconText.color as string}
          >
            !
          </MediCareText>
        </View>
        <MediCareText
          tag="h4"
          weight={FontWeight.Bold}
          color={styles.heading.color as string}
        >
          Tips for best results
        </MediCareText>
      </View>
      <View style={styles.tipsList}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.bullet} />
            <MediCareText
              tag="body"
              weight={FontWeight.Regular}
              color={styles.tipText.color as string}
            >
              {tip.text}
            </MediCareText>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TipsSection;

const useStyle = makeStyles(theme => ({
  container: {
    padding: 16,
    backgroundColor: theme.background[70],
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: theme.white,
  },
  heading: {
    color: theme.primary,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.text[90],
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    color: theme.text[110],
    flex: 1,
  },
}));
