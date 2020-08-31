import { createApp } from 'vue';

import App from './app.vue';
import i18n from './locales';
import { routes, State, stores } from './modules';
import buildRouter from './routes';
import buildStore from './stores';
import { RootState } from './stores/root';

import './registerServiceWorker';

export type AppState = RootState & State;

createApp(App).use(i18n).use(buildStore(stores)).use(buildRouter(routes)).mount('#app');
