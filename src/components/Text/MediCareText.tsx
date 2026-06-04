import { Text, TextProps } from 'react-native';
import React from 'react';
import { makeStyles } from '../../hooks/makeStyle';

export enum FontWeight {
  Thin = 'Thin',
  UltraLight = 'UltraLight',
  Light = 'Light',
  Regular = 'Regular',
  Medium = 'Medium',
  SemiBold = 'SemiBold',
  Bold = 'Bold',
  ExtraBold = 'ExtraBold',
}

type Tags =
  | 'extraLarge'
  | 'large'
  | 'medium'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'body'
  | 'body2';

interface Props extends TextProps {
  children?: React.ReactNode;
  tag?: Tags;
  weight?: string;
  color?: string;
}

const MediCareText: React.FC<Props> = ({
  children,
  style,
  tag = 'h2',
  weight = FontWeight.Medium,
  color,
  ...rest
}) => {
  const styles = useStyle({ weight, color });
  return (
    <Text
      style={[styles.common, styles[tag as keyof typeof styles], style]}
      allowFontScaling={false}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default MediCareText;

interface StyleProps {
  weight: string;
  color?: string;
}

const useStyle = makeStyles((theme, props: StyleProps) => ({
  common: {
    color: props.color ?? theme.black,
    fontFamily: 'Gilroy-' + props.weight,
  },
  extraLarge: {
    fontSize: 48,
    lineHeight: 60,
  },
  large: {
    fontSize: 30,
    lineHeight: 38,
  },
  medium: {
    fontSize: 24,
    lineHeight: 32,
  },
  h1: {
    fontSize: 22,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    lineHeight: 25,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
  },
  h4: {
    fontSize: 16,
    lineHeight: 22,
  },
  h5: {
    fontSize: 15,
    lineHeight: 18,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  body2: {
    fontSize: 12,
    lineHeight: 16,
  },
}));
