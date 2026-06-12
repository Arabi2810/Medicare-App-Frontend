import { DefaultTheme } from '@react-navigation/native';

export const createLightTheme = () => ({
  ...DefaultTheme,
  primary: '#3F7FF6',
  secondary: '#001941',
  success: '#00B84A',
  info: '#3EAEFF',
  warning: '#FFA23A',
  error: {
    90: '#FE5050',
    100: '#E22739',
  },
  background: {
    50: '#E2ECFEBF',
    60: '#DBEEE3',
    70: '#F5F7F9',
    80: '#F6F7F8',
    90: '#F3F4F4',
    100: '#ADB3B8',
    110: '#F2F2F2B0',
    120: '#00B84A1A',
    130: '#2563EB',
  },
  border: {
    80: '#ECECEC',
    90: '#E8E8E8',
    100: '#DEDEDE',
  },
  shadow: {
    90: '#EAEAEB',
    100: '#0F182E0D',
  },
  text: {
    70: '#B0B6CE',
    80: '#8C949C',
    90: '#848D94',
    100: '#768089',
    110: '#021943',
  },
  black: '#000000',
  white: '#FFFFFF',
  whiteTransparent: 'rgba(255, 255, 255, 0.8)',
  indigo: {
    100: '#E0E7FF',
    600: '#4F46E5',
  },
  green: {
    100: '#DCFCE7',
    500: '#22C55E',
    800: '#166534',
  },
  yellow: {
    100: '#FEF9C3',
    800: '#854D0E',
  },
  blue: {
    500: '#3B82F6',
  },
});
export const createDarkTheme = () => ({
  ...DefaultTheme,
  dark: true,
  primary: '#818cf8',
  secondary: '#1e293b',
  success: '#4ade80',
  info: '#7dd3fc',
  warning: '#fbbf24',
  error: { 90: '#fca5a5', 100: '#f87171' },
  background: {
    50: '#252836', 60: '#21242f', 70: '#1c1e29',
    80: '#2a2d3a', 90: '#3a3f51', 100: '#5b6178',
    110: '#252836', 120: '#1f3a2e1a', 130: '#a5b4fc',
  },
  border: { 80: '#3a3f51', 90: '#4b5168', 100: '#5b6178' },
  shadow: { 90: '#00000030', 100: '#00000050' },
  text: { 70: '#a3aab8', 80: '#b4bbc8', 90: '#cfd3dc', 100: '#e4e7ed', 110: '#f5f6f8' },
  black: '#e4e7ed',
  white: '#2a2d3a',
  whiteTransparent: 'rgba(42, 45, 58, 0.85)',
  indigo: { 100: '#3730a3', 600: '#a5b4fc' },
  green: { 100: '#14532d', 500: '#4ade80', 800: '#bbf7d0' },
  yellow: { 100: '#422006', 800: '#fde68a' },
  blue: { 500: '#7dd3fc' },
});

export type CustomTheme = ReturnType<typeof createLightTheme> | ReturnType<typeof createDarkTheme>;

declare module '@react-navigation/native' {
  export function useTheme(): CustomTheme;
}
