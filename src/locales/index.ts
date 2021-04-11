import { createI18n } from 'vue-i18n';
import { ref } from 'vue';
import Http from '@/utils/http.util';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';

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
  Http.setHeaders({ 'Accept-Language': lang });
  (document.querySelector('html') as HTMLElement).setAttribute('lang', lang);
  return lang;
};

export const isLanguageSupported = (lang: LocaleLanguages): boolean => Object.values(LocaleLanguages).includes(lang);

export const loadTranslationsAsync = async (locale: LocaleLanguages = LocaleLanguages.English): Promise<void> => {
  if (i18n.global.locale === currentLocale.value) {
    return;
  }

  const messages = (await Http.get<Record<string, string>>({ url: `/locales/${locale}.json` }))?.data;
  if (messages) {
    i18n.global.setLocaleMessage(locale, messages);
    setStorageItem(STORAGE_KEY, messages);
    currentLocale.value = locale;
    setLanguage(locale);
  }
};

export default i18n;
