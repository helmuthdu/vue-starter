import { createI18n } from 'vue-i18n';
import { ref } from 'vue';
import { getStorageItem, Http, setStorageItem } from '@/utils';

export type Locale = typeof locales[keyof typeof locales];

export const locales = {
  english: 'en-US'
} as const;

const currentLocale = ref<Locale | undefined>(undefined);

const STORAGE_KEY = 'locale';

export const i18n = createI18n({
  globalInjection: true,
  locale: locales.english,
  fallbackLocale: locales.english,
  messages: getStorageItem(STORAGE_KEY, {})
});

export const setLanguage = (locale: Locale): string => {
  i18n.global.locale = locale;
  Http.setHeaders({ 'Accept-Language': locale });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', locale);
  return locale;
};

export const isLanguageSupported = (lang: Locale): boolean => Object.values(locales).includes(lang);

export const loadTranslationsAsync = async (locale: Locale = locales.english): Promise<void> => {
  if (i18n.global.locale === currentLocale.value) {
    return;
  }

  const message = await Http.get<Record<string, string>>(`/locales/${locale}.json`);
  if (!message) {
    throw new Error('Empty translation file');
  }
  i18n.global.setLocaleMessage(locale, message.data);
  setStorageItem(STORAGE_KEY, message);
  currentLocale.value = locale;
  setLanguage(locale);
};

export default i18n;
