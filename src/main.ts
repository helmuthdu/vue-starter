import App from '@/app.vue';
import { routes, State, stores } from './modules';
import createRouter from './routes';
import createStore from './stores';
import { RootState } from './stores/root';
import Vue from 'vue';

import 'vuetify/dist/vuetify.css';
import './hooks';
import './plugins';
import './registerServiceWorker';
import Vuetify from 'vuetify';

Vue.config.productionTip = false;

export type AppState = RootState & State;

new Vue({
  vuetify: new Vuetify(),
  router: createRouter(routes),
  store: createStore(stores),
  render: h => h(App)
}).$mount('#app');
