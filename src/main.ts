import { createApp } from 'vue';

import App from './app.vue';
import { router } from './routes';

createApp(App).use(router).mount('#app');
