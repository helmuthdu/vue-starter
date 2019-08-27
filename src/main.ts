import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import App from '@/app.vue';
import { routes, State, stores } from './modules';
import createRouter from './routes';
import createStore from './stores';
import { RootState } from './stores/root';

import './plugins';
import './hooks';
import './registerServiceWorker';

import 'vuetify/dist/vuetify.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

export type AppState = RootState & State;

new Vue({
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi'
    }
  }),
  router: createRouter(routes),
  store: createStore(stores),
  render: h => h(App)
}).$mount('#app');
