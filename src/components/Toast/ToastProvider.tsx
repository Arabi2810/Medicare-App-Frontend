// src/components/Toast/ToastProvider.tsx
import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastData, ToastType } from './Toast';

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

// ─── Global bridge (for non-hook contexts like alert.ts) ─────────────────────

let _globalShowToast: ((message: string, type?: ToastType) => void) | null = null;

export function setGlobalToast(fn: (message: string, type?: ToastType) => void) {
  _globalShowToast = fn;
}

export function globalShowToast(message: string, type: ToastType = 'info') {
  if (_globalShowToast) {
    _globalShowToast(message, type);
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const insets = useSafeAreaInsets();
  const idCounter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = String(++idCounter.current);
    setToasts(prev => {
      // Keep at most 3 toasts visible at once
      const next = [...prev, { id, message, type }];
      return next.slice(-3);
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View
        style={[styles.toastStack, { top: insets.top + 8 }]}
        pointerEvents="box-none"
      >
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast() {
  return useContext(ToastContext);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  toastStack: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});