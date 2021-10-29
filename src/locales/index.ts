import { createI18n } from 'vue-i18n';
import { getStorageItem, Http, setStorageItem } from '@/utils';

export type Locale = typeof locales[keyof typeof locales];
export type LocaleStorage = { locale: Locale; messages: any; version: string };

const STORAGE_KEY = 'locale';
const APP_VERSION = process.env.VUE_APP_VERSION;

export const locales = {
  english: 'en-US'
} as const;

const getLocaleStorage = () => getStorageItem<LocaleStorage>(STORAGE_KEY) ?? {};

export const i18n = createI18n({
  globalInjection: true,
  locale: getLocaleStorage().locale ?? locales.english,
  fallbackLocale: locales.english,
  messages: getLocaleStorage().messages ?? {}
});

export const configureLocale = (locale: Locale): Locale => {
  i18n.global.locale = locale;
  Http.setHeaders({ 'Accept-Language': locale });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', locale);
  return locale;
};

export const isLanguageSupported = (lang: Locale): boolean => Object.values(locales).includes(lang);

export const loadTranslations = async (locale: Locale = locales.english): Promise<void> => {
  const storageLocale = getLocaleStorage();

  if (storageLocale.locale === locale && storageLocale.version === APP_VERSION) {
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
    version: APP_VERSION,
    locale,
    messages: { ...storageLocale?.messages, [locale]: messages }
  });

  i18n.global.setLocaleMessage(locale, messages);
  configureLocale(locale);
};

export default i18n;
