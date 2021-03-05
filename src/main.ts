import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';
import { buildRouter } from './routes';
import { buildStore, storeKey } from './stores';

import './registerServiceWorker';

createApp(App).use(i18n).use(buildStore(), storeKey).use(buildRouter()).mount('#app');
