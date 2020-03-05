import axios from 'axios';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export enum LocaleLanguages {
  English = 'en-US'
}

const loadedLanguages: LocaleLanguages[] = []; // our default language that is preloaded

export const i18n = new VueI18n({
  locale: LocaleLanguages.English, // set locale
  fallbackLocale: LocaleLanguages.English
});

export const setLanguage = (lang: LocaleLanguages) => {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  (document.querySelector('html') as HTMLElement).setAttribute('lang', lang);
  return lang;
};

export const loadLanguageAsync = (lang: LocaleLanguages = LocaleLanguages.English) => {
  // If the same language
  if (i18n.locale === lang && loadedLanguages.includes(lang)) {
    return Promise.resolve(setLanguage(lang));
  }

  // If the language hasn't been loaded yet
  return import(/* webpackChunkName: "lang-[request]" */ `@/locales/messages/${lang}.json`).then(messages => {
    i18n.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setLanguage(lang);
  });
};

export default i18n;
