import {
  Pressable,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText from '../Text/MediCareText';

export enum ButtonType {
  Primary,
  Secondary,
  Form,
  FormSelected,
  LoginPrimary,
  LoginSecondary,
  File,
}

interface Props {
  type?: ButtonType;
  style?: StyleProp<ViewStyle>;
  title: string;
  rightArrow?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
}

const MediCareButton: React.FC<Props> = ({
  type = ButtonType.Primary,
  style,
  title,
  rightArrow = false,
  disabled = false,
  isLoading = false,
  onPress,
}) => {
  const theme = useTheme();
  const styles = useStyle({
    type,
    disabled: disabled || isLoading,
    loginTextColor: theme.primary,
    hasRightArrow: rightArrow,
  });
  return (
    <Pressable
      style={[styles.cont, style]}
      disabled={disabled || isLoading}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.white} />
      ) : (
        <MediCareText
          numberOfLines={1}
          style={styles.text}
          allowFontScaling={false}
        >
          {title}
        </MediCareText>
      )}
      {/* {rightArrow && <RightArrow style={styles.rightArrow} stroke={'#000'} />} */}
    </Pressable>
  );
};

export default MediCareButton;

interface StyleProps {
  type: ButtonType;
  disabled: boolean;
  loginTextColor: string;
  hasRightArrow: boolean;
}

const useStyle = makeStyles((theme, props: StyleProps) => ({
  cont: {
    borderRadius: 16,
    borderWidth: props.type === ButtonType.File ? 0 : 1,
    borderColor: (() => {
      if (props.disabled) {
        return theme.background[100];
      }
      switch (props.type) {
        case ButtonType.Primary:
        case ButtonType.Secondary:
        case ButtonType.FormSelected:
          return theme.primary;
        case ButtonType.Form:
          return theme.background[100];
        case ButtonType.LoginPrimary:
        case ButtonType.LoginSecondary:
          return theme.white;
      }
    })(),
    height: 52,
    justifyContent: 'center',
    backgroundColor: (() => {
      switch (props.type) {
        case ButtonType.Primary:
          return props.disabled ? theme.background[100] : theme.primary;
        case ButtonType.Secondary:
        case ButtonType.Form:
          return theme.white;
        case ButtonType.FormSelected:
          return props.disabled ? theme.white : theme.background[70];
        case ButtonType.LoginPrimary:
          return theme.white;
        case ButtonType.LoginSecondary:
          return 'transparent';
        case ButtonType.File:
          return theme.border[90];
      }
    })(),
  },
  text: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 16,
    lineHeight: 16,
    marginTop: 2, // Needed to centre text correctly
    marginHorizontal: props.hasRightArrow ? 49 : 16,
    textTransform:
      props.type === ButtonType.Primary ||
      props.type === ButtonType.Secondary ||
      props.type === ButtonType.LoginPrimary ||
      props.type === ButtonType.LoginSecondary ||
      props.type === ButtonType.File
        ? 'uppercase'
        : 'none',
    textAlign: 'center',
    color: (() => {
      switch (props.type) {
        case ButtonType.Primary:
        case ButtonType.LoginSecondary:
          return theme.white;
        case ButtonType.Secondary:
        case ButtonType.FormSelected:
        case ButtonType.File:
          return props.disabled ? theme.background[100] : theme.primary;
        case ButtonType.Form:
          return props.disabled ? theme.background[100] : theme.black;
        case ButtonType.LoginPrimary:
          return props.loginTextColor;
      }
    })(),
  },
  rightArrow: {
    position: 'absolute',
    right: 24,
    alignSelf: 'center',
  },
}));
