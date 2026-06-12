// src/components/Toast/Toast.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet, Text } from 'react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#f0fdf4', border: '#22c55e', icon: '\u2713' },
  error:   { bg: '#fef2f2', border: '#ef4444', icon: '\u2715' },
  warning: { bg: '#fffbeb', border: '#f59e0b', icon: '\u26a0' },
  info:    { bg: '#eff6ff', border: '#3b82f6', icon: 'i' },
};

const ICON_COLORS: Record<ToastType, string> = {
  success: '#16a34a',
  error:   '#dc2626',
  warning: '#d97706',
  info:    '#2563eb',
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => dismiss(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  };

  const palette = COLORS[toast.type];
  const iconColor = ICON_COLORS[toast.type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: palette.bg,
          borderLeftColor: palette.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: palette.border }]}>
        <Text style={styles.iconText}>{palette.icon}</Text>
      </View>
      <Text style={styles.message} numberOfLines={3}>
        {toast.message}
      </Text>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={[styles.closeBtn, { color: iconColor }]}>{'\u2715'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    gap: 10,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  closeBtn: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 0,
  },
});

export default Toast;