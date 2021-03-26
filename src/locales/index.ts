import axios from 'axios';
import { createI18n } from 'vue-i18n';

export enum LocaleLanguages {
  English = 'en-US',
  German = 'de-DE'
}

type LocaleMessage = {
  locale: LocaleLanguages;
  messages: Record<string, string>;
};

const loadedLanguages: LocaleMessage[] = []; // our default language that is preloaded

export const i18n = createI18n({
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

export const loadLanguageAsync = (language: LocaleLanguages = LocaleLanguages.English): Promise<void> => {
  const currentLocale = loadedLanguages.find(localeMessage => localeMessage.locale === language);

  if (currentLocale) {
    if ((i18n.global.locale as any) === language) {
      return Promise.resolve();
    }

    i18n.global.setLocaleMessage(currentLocale.locale, currentLocale.messages);
    setLanguage(currentLocale.locale);
    return Promise.resolve();
  }

  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/messages/${language}.json`).then(messages => {
    i18n.global.setLocaleMessage(language, messages);
    loadedLanguages.push({ locale: language, messages });
    setLanguage(language);
  });
};

export default i18n;
