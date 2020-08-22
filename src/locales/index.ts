import axios from 'axios';
import { createI18n } from 'vue-i18n';

export enum LocaleLanguages {
  English = 'en-US',
  German = 'de-DE'
}

const loadedLanguages: LocaleLanguages[] = []; // our default language that is preloaded

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

export const loadLanguageAsync = (lang: LocaleLanguages = LocaleLanguages.English): Promise<string> => {
  // If the same language
  if ((i18n.global.locale as any) === lang && loadedLanguages.includes(lang)) {
    return Promise.resolve(setLanguage(lang));
  }

  // If the language hasn't been loaded yet
  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/messages/${lang}.json`).then(messages => {
    i18n.global.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setLanguage(lang);
  });
};

export default i18n;
