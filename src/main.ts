import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';
import { routes, stores } from './modules';
import { buildRouter } from './routes';
import { buildStore } from './stores';

import './registerServiceWorker';

createApp(App).use(i18n).use(buildStore(stores)).use(buildRouter(routes)).mount('#app');
