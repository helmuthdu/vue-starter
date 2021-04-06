import axios from 'axios';
import { createI18n } from 'vue-i18n';
import { ref } from 'vue';

export enum LocaleLanguages {
  English = 'en',
  German = 'de'
}

type LocaleMessage = {
  locale: LocaleLanguages;
  messages: Record<string, string>;
};

const currentLocale = ref<LocaleMessage>({
  locale: LocaleLanguages.English,
  messages: {}
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
  const { locale, messages } = currentLocale.value;
  if (locale === language) {
    if ((i18n.global.locale as any) === language) {
      return;
    }

    i18n.global.setLocaleMessage(locale, messages);
    setLanguage(locale);
    return;
  }

  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/messages/${language}.json`).then(messages => {
    i18n.global.setLocaleMessage(language, messages.default);
    currentLocale.value = { locale: language, messages: messages.default };
    setLanguage(language);
  });
};

export default i18n;
