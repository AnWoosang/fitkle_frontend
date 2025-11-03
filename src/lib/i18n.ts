import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ko from '@/i18n/messages/ko.json';
import en from '@/i18n/messages/en.json';
import zh from '@/i18n/messages/zh.json';
import ja from '@/i18n/messages/ja.json';
import es from '@/i18n/messages/es.json';
import vi from '@/i18n/messages/vi.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
      es: { translation: es },
      vi: { translation: vi },
    },
    fallbackLng: 'ko',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
      cookieMinutes: 525600, // 1 year
    },
  });

export default i18n;
