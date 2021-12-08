import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';
import { router } from './routes';
import { key, store } from './stores';

import './registerServiceWorker';

createApp(App).use(i18n).use(router).use(store, key).mount('#app');
