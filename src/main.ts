import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './app.vue';
import i18n from './locales';
import { router } from './routes';

createApp(App).use(i18n).use(router).use(createPinia()).mount('#app');
