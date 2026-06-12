import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLightTheme, createDarkTheme } from '@src/theme/theme';
import { Lang } from '@src/i18n/translations';

type AppTheme = ReturnType<typeof createLightTheme>;

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
  theme: AppTheme;
  language: Lang;
  setLanguage: (lang: Lang) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  theme: createLightTheme(),
  language: 'English',
  setLanguage: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLang] = useState<Lang>('English');

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(val => {
      if (val === 'true') setIsDark(true);
    });
    AsyncStorage.getItem('appLanguage').then(val => {
      if (val === 'বাংলা') setLang('বাংলা');
    });
  }, []);

  const toggleTheme = (value: boolean) => {
    setIsDark(value);
    AsyncStorage.setItem('darkMode', String(value));
  };

  const setLanguage = (lang: Lang) => {
    setLang(lang);
    AsyncStorage.setItem('appLanguage', lang);
  };

  const theme = isDark ? createDarkTheme() : createLightTheme();

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);