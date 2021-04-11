import axios from 'axios';
import { createI18n } from 'vue-i18n';
import { ref } from 'vue';
import Logger from '@/utils/logger.util';

export enum LocaleLanguages {
  English = 'en',
  German = 'de'
}

type LocaleMessage = {
  locale: LocaleLanguages;
  messages?: Record<string, string>;
};

const currentLocale = ref<LocaleMessage>({
  locale: LocaleLanguages.English,
  messages: undefined
});

export const i18n = createI18n({
  globalInjection: true,
  locale: LocaleLanguages.English, // set locale
  fallbackLocale: LocaleLanguages.English,
  messages: {} // set locale messages
});

export const setLanguage = (lang: LocaleLanguages): string => {
  (i18n.global.locale as any) = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  (document.querySelector('html') as HTMLElement).setAttribute('lang', lang);
  return lang;
};

export const loadLanguageAsync = async (language: LocaleLanguages = LocaleLanguages.English): Promise<void> => {
  const { messages } = currentLocale.value;
  if ((i18n.global.locale as any) === language && messages) {
    return;
  }

  try {
    return import(/* webpackChunkName: "lang-[request]" */ `./messages/${language}.json`).then(messages => {
      i18n.global.setLocaleMessage(language, messages.default);
      currentLocale.value = { locale: language, messages: messages.default };
      setLanguage(language);
    });
  } catch (err) {
    Logger.error('Failed to load translations');
    return Promise.resolve();
  }
};

export default i18n;
