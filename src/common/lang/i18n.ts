import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Polish from './locales/pl-PL.json'
import English from './locales/en-EN.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ["en", "pl"],
    resources: {
      en: { translation: English },
      pl: { translation: Polish }
    },
  });

export default i18next;
