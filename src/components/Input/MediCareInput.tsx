import React, { useState } from 'react';
import { View, TextInput, TextInputProps, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';

interface Props extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}

const MediCareInput: React.FC<Props> = ({
  label,
  style,
  containerStyle,
  error,
  secureTextEntry,
  ...rest
}) => {
  const styles = useStyle({ hasError: !!error });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry === true;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && (
        <MediCareText tag="body" weight={FontWeight.Medium} style={styles.label}>
          {label}
        </MediCareText>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, isPassword && styles.inputWithIcon, style]}
          placeholderTextColor={styles.placeholder.color as string}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(prev => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MediCareText tag="body" style={styles.eyeIcon}>
              {isPasswordVisible ? '👁️' : '🔒'}
            </MediCareText>
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <MediCareText tag="body2" weight={FontWeight.Regular} style={styles.errorText}>
          {error}
        </MediCareText>
      )}
    </View>
  );
};

export default MediCareInput;

const useStyle = makeStyles((theme, props: { hasError?: boolean }) => ({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
    color: theme.text[110],
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: props.hasError ? theme.error[100] : theme.border[90],
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Gilroy-Regular',
    backgroundColor: theme.white,
    color: theme.text[110],
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    height: 52,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  placeholder: {
    color: theme.text[80],
  },
  errorText: {
    marginTop: 4,
    color: theme.error[100],
  },
}));
