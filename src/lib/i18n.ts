import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import el from '../locales/el.json';
import ru from '../locales/ru.json';
import he from '../locales/he.json';

const getSavedLanguage = (): string => {
  const saved = localStorage.getItem('energeia_language');
  if (saved) return saved;
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supported = ['en', 'el', 'ru', 'he'];
  return supported.includes(browserLang) ? browserLang : 'en';
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
