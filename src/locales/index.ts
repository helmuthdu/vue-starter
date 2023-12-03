import { createI18n } from 'vue-i18n';
import { getStorageItem, Http, setStorageItem } from '@/utils';

const STORAGE_KEY = 'locale';
const APP_VERSION = import.meta.env.VITE_VERSION;

export type Locale = (typeof locales)[keyof typeof locales];
export type LocaleStorage = { locale: Locale; messages: Record<string, any>; version: string };

export const locales = {
  english: 'en-US',
} as const;

const getLocaleStorage = () =>
  getStorageItem<LocaleStorage>(STORAGE_KEY) ?? { locale: undefined, messages: {}, version: undefined };

export const isLanguageSupported = (lang: Locale): boolean => Object.values(locales).includes(lang);

export const i18n = createI18n({
  legacy: false,
  locale: getLocaleStorage().locale ?? locales.english,
  fallbackLocale: locales.english,
  messages: getLocaleStorage().messages ?? {},
});

export const setLocale = (locale: Locale, messages: Record<string, any>): Locale => {
  i18n.global.locale.value = locale;
  i18n.global.setLocaleMessage(locale, messages);
  Http.setHeaders({ 'Accept-Language': locale });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', locale);

  return locale;
};

export const loadTranslations = async (locale: Locale = locales.english): Promise<void> => {
  const localeStorage = getLocaleStorage();

  if (localeStorage.locale === locale && localeStorage.version === APP_VERSION) {
    return;
  }

  if (!isLanguageSupported(locale)) {
    throw new Error('Locale not supported');
  }

  const messages = (await import(`./messages/${locale}.json`)).default;

  if (!messages) {
    throw new Error('Empty translations file');
  }

  setStorageItem(STORAGE_KEY, {
    locale,
    messages: { [locale]: messages },
    version: APP_VERSION,
  });

  setLocale(locale, messages);
};

export default i18n;
