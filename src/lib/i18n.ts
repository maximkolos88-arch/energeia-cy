import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';

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

const initialLang = getSavedLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export async function loadLanguageBundle(lang: string): Promise<void> {
  if (lang === 'en' || i18n.hasResourceBundle(lang, 'translation')) {
    await i18n.changeLanguage(lang);
    return;
  }
  let bundle: any;
  if (lang === 'el') bundle = (await import('../locales/el.json')).default;
  else if (lang === 'ru') bundle = (await import('../locales/ru.json')).default;
  else if (lang === 'he') bundle = (await import('../locales/he.json')).default;
  if (bundle) {
    i18n.addResourceBundle(lang, 'translation', bundle, true, true);
  }
  await i18n.changeLanguage(lang);
}

if (typeof window !== 'undefined' && initialLang !== 'en') {
  loadLanguageBundle(initialLang);
}

export default i18n;
