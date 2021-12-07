import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';
import { router } from './routes';

createApp(App).use(i18n).use(router).mount('#app');
