import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enResearch from './locales/en/research.json';
import enCollaboration from './locales/en/collaboration.json';
import enProcurement from './locales/en/procurement.json';
import taCommon from './locales/ta/common.json';
import taHome from './locales/ta/home.json';
import taAbout from './locales/ta/about.json';
import taResearch from './locales/ta/research.json';
import taCollaboration from './locales/ta/collaboration.json';
import taProcurement from './locales/ta/procurement.json';
import siCommon from './locales/si/common.json';
import siHome from './locales/si/home.json';
import siAbout from './locales/si/about.json';
import siResearch from './locales/si/research.json';
import siCollaboration from './locales/si/collaboration.json';
import siProcurement from './locales/si/procurement.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    research: enResearch,
    collaboration: enCollaboration,
    procurement: enProcurement
  },
  ta: {
    common: taCommon,
    home: taHome,
    about: taAbout,
    research: taResearch,
    collaboration: taCollaboration,
    procurement: taProcurement
  },
  si: {
    common: siCommon,
    home: siHome,
    about: siAbout,
    research: siResearch,
    collaboration: siCollaboration,
    procurement: siProcurement
  }
};

const getStoredLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem('nara-lang');
  if (stored && resources[stored]) {
    return stored;
  }

  const browserLang = window.navigator.language.split('-')[0];
  if (browserLang && resources[browserLang]) {
    return browserLang;
  }

  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    ns: ['common', 'home', 'about', 'research', 'collaboration', 'procurement'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    returnObjects: true,
    react: {
      useSuspense: false
    }
  });

export const AVAILABLE_LANGUAGES = [
  { code: 'en', labelKey: 'language.english' },
  { code: 'ta', labelKey: 'language.tamil' },
  { code: 'si', labelKey: 'language.sinhala' }
];

export default i18n;
