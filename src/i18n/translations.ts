export type Lang = 'English' | 'বাংলা';

export const t = (key: string, lang: Lang): string => {
  const translations: Record<string, Record<Lang, string>> = {
    'settings.title':               { English: 'Settings',              'বাংলা': 'সেটিংস' },
    'settings.appearance':          { English: 'APPEARANCE',            'বাংলা': 'প্রদর্শনী' },
    'settings.darkMode':            { English: 'Dark Mode',             'বাংলা': 'ডার্ক মোড' },
    'settings.darkModeDesc':        { English: 'Switch to darker theme','বাংলা': 'গাঢ় থিমে পরিবর্তন করুন' },
    'settings.language':            { English: 'LANGUAGE',              'বাংলা': 'ভাষা' },
    'settings.notifications':       { English: 'NOTIFICATIONS',         'বাংলা': 'বিজ্ঞপ্তি' },
    'settings.medicationReminders': { English: 'Medication Reminders',  'বাংলা': 'ওষুধের অনুস্মারক' },
    'settings.medicationDesc':      { English: 'Reminders to take your medicines', 'বাংলা': 'ওষুধ খাওয়ার অনুস্মারক' },
    'settings.about':               { English: 'ABOUT',                 'বাংলা': 'পরিচিতি' },
    'settings.version':             { English: 'Version',               'বাংলা': 'সংস্করণ' },
    'reminders.title':              { English: 'Reminders',             'বাংলা': 'অনুস্মারক' },
    'reminders.dosesScheduled':     { English: 'doses scheduled',       'বাংলা': 'ডোজ নির্ধারিত' },
    'reminders.today':              { English: 'Today',                 'বাংলা': 'আজ' },
    'reminders.soundEnabled':       { English: 'Sound + Notification enabled', 'বাংলা': 'শব্দ + বিজ্ঞপ্তি চালু' },
    'reminders.paused':             { English: 'Reminder paused',       'বাংলা': 'অনুস্মারক বিরতিতে' },
    'dashboard.greeting':           { English: 'Hello',                 'বাংলা': 'হ্যালো' },
    'dashboard.tagline':            { English: 'Stay healthy, stay happy', 'বাংলা': 'সুস্থ থাকুন, সুখী থাকুন' },
    'common.save':                  { English: 'Save',                  'বাংলা': 'সংরক্ষণ করুন' },
    'common.cancel':                { English: 'Cancel',                'বাংলা': 'বাতিল' },
    'common.edit':                  { English: 'Edit',                  'বাংলা': 'সম্পাদনা' },
    'common.delete':                { English: 'Delete',                'বাংলা': 'মুছুন' },
    'settings.switchTheme':         { English: 'Switch to darker theme', 'বাংলা': 'গাঢ় থিমে পরিবর্তন করুন' },
    'settings.appName':              { English: 'MediCare',              'বাংলা': 'মেডিকেয়ার' },
    'settings.appDesc':              { English: 'AI-Powered Health App', 'বাংলা': 'এআই-চালিত স্বাস্থ্য অ্যাপ' },
  };
  return translations[key]?.[lang] ?? translations[key]?.['English'] ?? key;
};