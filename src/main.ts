import Vue, { CreateElement } from 'vue';
import VueI18n from 'vue-i18n';

import App from '@/app.vue';
import { routes, State, stores } from './modules';
import createRouter from './routes';
import createStore from './stores';
import { RootState } from './stores/root';

import './plugins';
import './hooks';
import './registerServiceWorker';

Vue.config.productionTip = false;

export type AppState = RootState & State;

new Vue({
  i18n: new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en',
    messages: { en: {} } // set locale messages
  }),
  router: createRouter(routes),
  store: createStore(stores),
  render: (h: CreateElement) => h(App)
}).$mount('#app');
