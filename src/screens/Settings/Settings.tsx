// src/screens/Settings/Settings.tsx
import React, { useState } from 'react';
import { View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { CloseSvg } from '@src/utils/icons';
import { useToast } from '@src/components/Toast/ToastProvider';
import { useAppTheme } from '@src/context/ThemeContext';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'English' | 'বাংলা';
const LANGUAGES: Language[] = ['English', 'বাংলা'];

const Settings = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const styles = useStyles();
  const { showToast } = useToast();
  const { isDark, toggleTheme } = useAppTheme();

  const [language, setLanguage] = useState<Language>('English');
  const [medicationReminders, setMedicationReminders] = useState(true);

  const handleDarkModeToggle = (val: boolean) => {
    toggleTheme(val);
    showToast(val ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    showToast(`Language set to ${lang}`, 'success');
  };

  const handleMedicationToggle = async (val: boolean) => {
    setMedicationReminders(val);
    try {
      if (!val) {
        await notifee.cancelAllNotifications();
        await AsyncStorage.setItem('medicationRemindersEnabled', 'false');
        showToast('Medication reminders turned off', 'warning');
      } else {
        await AsyncStorage.setItem('medicationRemindersEnabled', 'true');
        showToast('Medication reminders turned on — re-open the Reminders screen to reschedule', 'success');
      }
    } catch (e) {
      showToast('Failed to update notification setting', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <CloseSvg width={24} height={24} stroke={theme.white} />
        </TouchableOpacity>
        <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.white}>Settings</MediCareText>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Appearance */}
        <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[80]} style={styles.sectionLabel}>
          APPEARANCE
        </MediCareText>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MediCareText tag="body" style={styles.rowIcon}>🌙</MediCareText>
              <View>
                <MediCareText tag="h4" weight={FontWeight.Medium} color={theme.black}>Dark Mode</MediCareText>
                <MediCareText tag="body2" color={theme.text[80]}>Switch to a darker theme</MediCareText>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: theme.border[80], true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>

        {/* Language */}
        <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[80]} style={styles.sectionLabel}>
          LANGUAGE
        </MediCareText>
        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => (
            <TouchableOpacity
              key={lang}
              style={[styles.languageRow, index < LANGUAGES.length - 1 && styles.languageRowBorder]}
              onPress={() => handleLanguageSelect(lang)}
            >
              <MediCareText tag="h4" weight={FontWeight.Regular} color={theme.black}>{lang}</MediCareText>
              {language === lang && (
                <MediCareText tag="body" color={theme.primary} weight={FontWeight.Bold}>✓</MediCareText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[80]} style={styles.sectionLabel}>
          NOTIFICATIONS
        </MediCareText>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MediCareText tag="body" style={styles.rowIcon}>💊</MediCareText>
              <View>
                <MediCareText tag="h4" weight={FontWeight.Medium} color={theme.black}>Medication Reminders</MediCareText>
                <MediCareText tag="body2" color={theme.text[80]}>Reminders to take your medicines</MediCareText>
              </View>
            </View>
            <Switch
              value={medicationReminders}
              onValueChange={handleMedicationToggle}
              trackColor={{ false: theme.border[80], true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>

        {/* About */}
        <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[80]} style={styles.sectionLabel}>
          ABOUT
        </MediCareText>
        <View style={styles.card}>
          <View style={[styles.infoRow, styles.rowBorder]}>
            <MediCareText tag="h4" weight={FontWeight.Regular} color={theme.black}>Version</MediCareText>
            <MediCareText tag="body" color={theme.text[80]}>1.0.0</MediCareText>
          </View>
          <View style={styles.infoRow}>
            <MediCareText tag="h4" weight={FontWeight.Regular} color={theme.black}>MediCare</MediCareText>
            <MediCareText tag="body" color={theme.text[80]}>AI-Powered Health App</MediCareText>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: { flex: 1, backgroundColor: theme.background[70] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.primary,
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionLabel: { marginBottom: 8, marginTop: 8, letterSpacing: 0.5, fontSize: 12 },
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.border[80] },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 12 },
  rowIcon: { fontSize: 20 },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  languageRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.border[80] },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
}));

export default Settings;