import { devtools } from '@nanostores/vue/devtools';
import { createApp } from 'vue';
import { stores } from '@/modules';
import App from './app.vue';
import { router } from './routes';

createApp(App)
  .use(
    devtools,
    Object.entries(stores).reduce((acc, [key, val]) => ({ ...acc, [key]: val.store.state }), {}),
  )
  .use(router)
  .mount('#app');
