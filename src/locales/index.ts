import { createI18n } from 'vue-i18n';
import { Http } from '@/utils';

export type Locale = typeof locales[keyof typeof locales];

export const locales = {
  english: 'en-US'
} as const;

let currentLocale: Locale;

export const i18n = createI18n({
  globalInjection: true,
  locale: locales.english,
  fallbackLocale: locales.english,
  messages: {}
});

export const configureLocale = (locale: Locale): Locale => {
  i18n.global.locale = locale;
  Http.setHeaders({ 'Accept-Language': locale });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', locale);
  return locale;
};

export const isLanguageSupported = (lang: Locale): boolean => Object.values(locales).includes(lang);

export const loadTranslations = async (locale: Locale = locales.english): Promise<void> => {
  if (currentLocale === locale) {
    return;
  }

  const messages = (await import(`./messages/${locale}.json`)).default;
  if (!messages) {
    throw new Error('Empty translation file');
  }

  i18n.global.setLocaleMessage(locale, messages);
  currentLocale = configureLocale(locale);
};

export default i18n;
