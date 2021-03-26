import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';
import { router } from './routes';
import { store } from './stores';

import './registerServiceWorker';

createApp(App).use(i18n).use(router).use(store).mount('#app');
