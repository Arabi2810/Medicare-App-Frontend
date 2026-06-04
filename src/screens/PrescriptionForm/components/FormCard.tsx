import React from 'react';
import { View } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareInput from '@src/components/Input/MediCareInput';

interface FormCardProps {
  data: Record<string, any>;
  formatLabel?: (key: string) => string;
  onUpdate?: (fieldKey: string, value: string) => void;
  placeholders?: Record<string, string>;
}

const FormCard: React.FC<FormCardProps> = ({
  data,
  formatLabel = key => key,
  onUpdate,
  placeholders,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {Object.entries(data).map(([key, value]) => {
        if (value === null || value === undefined) {
          return (
            <MediCareInput
              key={key}
              label={formatLabel(key)}
              value=""
              onChangeText={(text) => onUpdate?.(key, text)}
              containerStyle={styles.inputContainer}
              placeholder={placeholders?.[key] || `Enter ${formatLabel(key).toLowerCase()}`}
            />
          );
        }

        return (
          <MediCareInput
            key={key}
            label={formatLabel(key)}
            value={String(value)}
            onChangeText={(text) => onUpdate?.(key, text)}
            containerStyle={styles.inputContainer}
            placeholder={placeholders?.[key]}
          />
        );
      })}
    </View>
  );
};

export default FormCard;

const useStyles = makeStyles(() => ({
  container: {
    gap: 12,
  },
  inputContainer: {
    marginBottom: 8,
  },
}));
