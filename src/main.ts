import { authRoutes, authStore } from '@/modules/auth';
import { RootState } from '@/store/root';
import createRouter from '@/router';
import createStore from '@/store';

import Vue from 'vue';
import App from './app.vue';

import './plugins';
import './registerServiceWorker';

Vue.config.productionTip = false;

export type AppState = RootState & {
  [authStore.name]: authStore.State;
};

new Vue({
  router: createRouter([authRoutes]),
  store: createStore([authStore]),
  render: h => h(App)
}).$mount('#app');
