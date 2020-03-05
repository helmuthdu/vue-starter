import Vue, { CreateElement } from 'vue';
import Vuetify from 'vuetify/lib';

import App from './app.vue';
import i18n from './locales';
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
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi'
    }
  }),
  i18n,
  router: createRouter(routes),
  store: createStore(stores),
  render: (h: CreateElement) => h(App)
}).$mount('#app');
