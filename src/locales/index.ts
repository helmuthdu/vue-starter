import { getStorageItem, Http, setStorageItem } from '@/utils';
import { browser, createI18n, formatter, localeFrom, Translations } from '@nanostores/i18n';
import { Messages } from '@nanostores/i18n/create-i18n';
import { useStore } from '@nanostores/vue';
import { atom } from 'nanostores';

const STORAGE_KEY = 'locale';
const APP_VERSION = import.meta.env.VITE_VERSION;

export type Locale = typeof locales[keyof typeof locales];
export type LocaleStorage = { locale: Locale; messages: Record<string, any>; version: string };

export const locales = {
  english: 'en-US'
} as const;

const getLocaleStorage = () =>
  getStorageItem<LocaleStorage>(STORAGE_KEY) ?? { locale: undefined, messages: {}, version: undefined };

export const isLanguageSupported = (loc: Locale): boolean => Object.values(locales).includes(loc);

export const currentLocale = atom<string>(getLocaleStorage().locale);

export const setCurrentLocale = (loc: Locale) => {
  if (!isLanguageSupported(loc)) {
    throw new Error('Locale not supported');
  }

  Http.setHeaders({ 'Accept-Language': loc });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', loc.split('-')[0]);

  if (currentLocale.get() !== loc) {
    currentLocale.set(loc);
  }
};

export const locale = localeFrom(
  currentLocale,
  browser({ available: Object.keys(locales), fallback: locales.english })
);

export const format = formatter(locale);

export const i18n = createI18n(locale, {
  async get(loc) {
    const localeStorage = getLocaleStorage();

    if (localeStorage.locale === loc && localeStorage.version === APP_VERSION) {
      return localeStorage.messages;
    }

    const messages = (await import(`./messages/${loc}.json`)).default;

    if (!messages) {
      throw new Error('Empty translations file');
    }

    setStorageItem(STORAGE_KEY, {
      locale: loc,
      messages,
      version: APP_VERSION
    });

    return messages;
  }
});

export const getTranslations = (name: string, translations: Translations = {}) => i18n(name, translations);

export const useI18n = (messages: Messages) => {
  return useStore(messages);
};
