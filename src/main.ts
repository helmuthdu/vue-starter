import Vue from 'vue';
import App from '@/app.vue';
import createRouter from '@/router';
import createStore from '@/store';
import { RootState } from '@/store/root';

import * as authModule from '@/modules/auth';

import './hooks';
import './plugins';
import './registerServiceWorker';

Vue.config.productionTip = false;

export type AppState = RootState & authModule.State;

new Vue({
  router: createRouter([authModule.routes]),
  store: createStore([authModule.stores]),
  render: h => h(App),
}).$mount('#app');
