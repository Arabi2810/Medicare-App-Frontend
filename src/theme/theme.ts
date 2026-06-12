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
  primary: '#6366f1',
  secondary: '#0f172a',
  success: '#22c55e',
  info: '#38bdf8',
  warning: '#fb923c',
  error: { 90: '#f87171', 100: '#ef4444' },
  background: {
    50: '#1e1e2e',
    60: '#1a2332',
    70: '#0f172a',
    80: '#1e293b',
    90: '#334155',
    100: '#64748b',
    110: '#1e1e2e',
    120: '#14532d1a',
    130: '#818cf8',
  },
  border: { 80: '#334155', 90: '#475569', 100: '#64748b' },
  shadow: { 90: '#00000040', 100: '#00000060' },
  text: {
    70: '#94a3b8',
    80: '#94a3b8',
    90: '#cbd5e1',
    100: '#e2e8f0',
    110: '#f1f5f9',
  },
  black: '#f1f5f9',
  white: '#1e293b',
  whiteTransparent: 'rgba(30, 41, 59, 0.8)',
  indigo: { 100: '#312e81', 600: '#818cf8' },
  green: { 100: '#14532d', 500: '#22c55e', 800: '#bbf7d0' },
  yellow: { 100: '#422006', 800: '#fef08a' },
  blue: { 500: '#60a5fa' },
});
export type CustomTheme = ReturnType<typeof createLightTheme> | ReturnType<typeof createDarkTheme>;

declare module '@react-navigation/native' {
  export function useTheme(): CustomTheme;
}
