import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import el from '../locales/el.json';
import ru from '../locales/ru.json';
import he from '../locales/he.json';

const getSavedLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('energeia_language') || localStorage.getItem('app_lang');
    if (saved) return saved;
    const browserLang = typeof navigator !== 'undefined' && navigator.language ? navigator.language.split('-')[0].toLowerCase() : 'en';
    const supported = ['en', 'el', 'ru', 'he'];
    return supported.includes(browserLang) ? browserLang : 'en';
  } catch (e) {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      el: { translation: el },
      ru: { translation: ru },
      he: { translation: he }
    },
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
