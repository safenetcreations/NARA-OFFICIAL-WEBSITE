import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enLda from './locales/en/lda.json';
import enMarketplace from './locales/en/marketplace.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enResearch from './locales/en/research.json';
import enCollaboration from './locales/en/collaboration.json';
import enNews from './locales/en/news.json';
import enProcurement from './locales/en/procurement.json';
import enResearchEnhanced from './locales/en/researchEnhanced.json';
import enDigitalLibrary from './locales/en/digitalLibrary.json';
import enKnowledge from './locales/en/knowledge.json';
import enMaritime from './locales/en/maritime.json';
import enIntegration from './locales/en/integration.json';
import enFishAdvisory from './locales/en/fishAdvisory.json';
import enAudiences from './locales/en/audiences.json';
import enContact from './locales/en/contact.json';
import enPublicConsultation from './locales/en/publicConsultation.json';
import enOpenData from './locales/en/openData.json';
import enMarineIncident from './locales/en/marineIncident.json';
import enExportMarket from './locales/en/exportMarket.json';
import enMediaGallery from './locales/en/mediaGallery.json';
import enVesselBooking from './locales/en/vesselBooking.json';
import taCommon from './locales/ta/common.json';
import taLda from './locales/ta/lda.json';
import taMarketplace from './locales/ta/marketplace.json';
import taHome from './locales/ta/home.json';
import taAbout from './locales/ta/about.json';
import taResearch from './locales/ta/research.json';
import taCollaboration from './locales/ta/collaboration.json';
import taNews from './locales/ta/news.json';
import taProcurement from './locales/ta/procurement.json';
import taResearchEnhanced from './locales/ta/researchEnhanced.json';
import taDigitalLibrary from './locales/ta/digitalLibrary.json';
import taKnowledge from './locales/ta/knowledge.json';
import taMaritime from './locales/ta/maritime.json';
import taIntegration from './locales/ta/integration.json';
import taFishAdvisory from './locales/ta/fishAdvisory.json';
import taAudiences from './locales/ta/audiences.json';
import taContact from './locales/ta/contact.json';
import taPublicConsultation from './locales/ta/publicConsultation.json';
import taOpenData from './locales/ta/openData.json';
import taMarineIncident from './locales/ta/marineIncident.json';
import taExportMarket from './locales/ta/exportMarket.json';
import taMediaGallery from './locales/ta/mediaGallery.json';
import taVesselBooking from './locales/ta/vesselBooking.json';
import siCommon from './locales/si/common.json';
import siLda from './locales/si/lda.json';
import siMarketplace from './locales/si/marketplace.json';
import siHome from './locales/si/home.json';
import siAbout from './locales/si/about.json';
import siResearch from './locales/si/research.json';
import siCollaboration from './locales/si/collaboration.json';
import siNews from './locales/si/news.json';
import siProcurement from './locales/si/procurement.json';
import siResearchEnhanced from './locales/si/researchEnhanced.json';
import siDigitalLibrary from './locales/si/digitalLibrary.json';
import siKnowledge from './locales/si/knowledge.json';
import siMaritime from './locales/si/maritime.json';
import siIntegration from './locales/si/integration.json';
import siFishAdvisory from './locales/si/fishAdvisory.json';
import siAudiences from './locales/si/audiences.json';
import siContact from './locales/si/contact.json';
import siPublicConsultation from './locales/si/publicConsultation.json';
import siOpenData from './locales/si/openData.json';
import siMarineIncident from './locales/si/marineIncident.json';
import siExportMarket from './locales/si/exportMarket.json';
import siMediaGallery from './locales/si/mediaGallery.json';
import siVesselBooking from './locales/si/vesselBooking.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    research: enResearch,
    collaboration: enCollaboration,
    procurement: enProcurement,
    news: enNews,
    researchEnhanced: enResearchEnhanced,
    digitalLibrary: enDigitalLibrary,
    knowledge: enKnowledge,
    lda: enLda,
    marketplace: enMarketplace,
    maritime: enMaritime,
    integration: enIntegration,
    fishAdvisory: enFishAdvisory,
    audiences: enAudiences,
    contact: enContact,
    publicConsultation: enPublicConsultation,
    openData: enOpenData,
    marineIncident: enMarineIncident,
    exportMarket: enExportMarket,
    mediaGallery: enMediaGallery,
    vesselBooking: enVesselBooking
  },
  ta: {
    common: taCommon,
    home: taHome,
    about: taAbout,
    research: taResearch,
    collaboration: taCollaboration,
    procurement: taProcurement,
    news: taNews,
    researchEnhanced: taResearchEnhanced,
    digitalLibrary: taDigitalLibrary,
    knowledge: taKnowledge,
    lda: taLda,
    marketplace: taMarketplace,
    maritime: taMaritime,
    integration: taIntegration,
    fishAdvisory: taFishAdvisory,
    audiences: taAudiences,
    contact: taContact,
    publicConsultation: taPublicConsultation,
    openData: taOpenData,
    marineIncident: taMarineIncident,
    exportMarket: taExportMarket,
    mediaGallery: taMediaGallery,
    vesselBooking: taVesselBooking
  },
  si: {
    common: siCommon,
    home: siHome,
    about: siAbout,
    research: siResearch,
    collaboration: siCollaboration,
    procurement: siProcurement,
    news: siNews,
    researchEnhanced: siResearchEnhanced,
    digitalLibrary: siDigitalLibrary,
    knowledge: siKnowledge,
    lda: siLda,
    marketplace: siMarketplace,
    maritime: siMaritime,
    integration: siIntegration,
    fishAdvisory: siFishAdvisory,
    audiences: siAudiences,
    contact: siContact,
    publicConsultation: siPublicConsultation,
    openData: siOpenData,
    marineIncident: siMarineIncident,
    exportMarket: siExportMarket,
    mediaGallery: siMediaGallery,
    vesselBooking: siVesselBooking
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
    ns: ['common', 'home', 'about', 'research', 'collaboration', 'procurement', 'news', 'researchEnhanced', 'digitalLibrary', 'knowledge', 'lda', 'marketplace', 'maritime', 'integration', 'fishAdvisory', 'audiences', 'contact', 'publicConsultation', 'openData', 'marineIncident', 'exportMarket', 'mediaGallery', 'vesselBooking'],
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
  { code: 'si', labelKey: 'language.sinhala' },
  { code: 'ta', labelKey: 'language.tamil' },
  { code: 'en', labelKey: 'language.english' }
];

export default i18n;
