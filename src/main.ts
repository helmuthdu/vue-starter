import Vue from 'vue';
import App from '@/app.vue';
import createRouter from '@/router';
import createStore from '@/store';
import { RootState } from '@/store/root';

import { authRoutes, authStore } from '@/modules/auth';

import './hooks';
import './plugins';
import './registerServiceWorker';

Vue.config.productionTip = false;

export type AppState = RootState & {
  [authStore.name]: authStore.State;
};

new Vue({
  router: createRouter([authRoutes]),
  store: createStore([authStore]),
  render: h => h(App),
}).$mount('#app');
