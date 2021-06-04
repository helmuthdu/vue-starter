import { createI18n } from 'vue-i18n';
import { ref } from 'vue';
import { getStorageItem, Http, setStorageItem } from '@/utils';

export enum LocaleLanguages {
  English = 'en-US'
}

const currentLocale = ref<LocaleLanguages | undefined>(undefined);

const STORAGE_KEY = 'locale';

export const i18n = createI18n({
  globalInjection: true,
  locale: LocaleLanguages.English,
  fallbackLocale: LocaleLanguages.English,
  messages: getStorageItem(STORAGE_KEY, {})
});

export const setLanguage = (lang: LocaleLanguages): string => {
  i18n.global.locale = lang;
  Http.setCustomHeaders({ 'Accept-Language': lang });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', lang);
  return lang;
};

export const isLanguageSupported = (lang: LocaleLanguages): boolean => Object.values(LocaleLanguages).includes(lang);

export const loadTranslationsAsync = async (locale: LocaleLanguages = LocaleLanguages.English): Promise<void> => {
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
