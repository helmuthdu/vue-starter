import App from '@/app.vue';
import { routes, State, stores } from '@/modules';
import createRouter from '@/routes';
import createStore from '@/store';
import { RootState } from '@/store/root';
import Vue from 'vue';

import './hooks';
import './plugins';
import './registerServiceWorker';

Vue.config.productionTip = false;

export type AppState = RootState & State;

new Vue({
  router: createRouter(routes),
  store: createStore(stores),
  render: h => h(App)
}).$mount('#app');
