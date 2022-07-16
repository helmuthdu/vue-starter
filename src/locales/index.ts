import { getStorageItem, Http, setStorageItem } from '@/utils';
import { createI18n } from 'vue-i18n';

export type Locale = typeof locales[keyof typeof locales];
export type LocaleStorage = { locale: Locale; messages: any; version: string };

const STORAGE_KEY = 'locale';
const APP_VERSION = process.env.VUE_APP_VERSION;

export const locales = {
  english: 'en-US'
} as const;

const getLocaleStorage = () =>
  getStorageItem<LocaleStorage>(STORAGE_KEY) ?? { locale: undefined, messages: {}, version: undefined };

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
  const localeStorage = getLocaleStorage();

  if (localeStorage.locale === locale && localeStorage.version === APP_VERSION) {
    return;
  }

  if (!isLanguageSupported(locale)) {
    throw new Error('Locale not supported');
  }

  configureLocale(locale);

  if (localeStorage.messages[locale] && localeStorage.version === APP_VERSION) {
    setStorageItem(STORAGE_KEY, { ...localeStorage, locale });
    i18n.global.setLocaleMessage(locale, localeStorage.messages[locale]);
  } else {
    import(`./messages/${locale}.json`).then(({ default: messages }) => {
      if (!messages) {
        throw new Error('Empty translations file');
      }
      setStorageItem(STORAGE_KEY, {
        locale,
        messages: { ...localeStorage.messages, [locale]: messages },
        version: APP_VERSION
      });
      i18n.global.setLocaleMessage(locale, messages);
    });
  }
};

export default i18n;
