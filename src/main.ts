import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';

import './registerServiceWorker';
import { router } from './routes';
import { store } from './stores';

createApp(App).use(i18n).use(router).use(store).mount('#app');
