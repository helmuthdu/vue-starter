import { AppState } from '../main';
import { rootStore } from './root';
import { createStore, Store } from 'vuex';
import VuexPersist from 'vuex-persist';
import localForage from 'localforage';

export let store: Store<AppState>;

const buildStore = (modules: any[]): Store<AppState> => {
  const vuexStorage = new VuexPersist({
    key: 'snapshot',
    storage: localForage as any
  });

  store = createStore({
    plugins: [vuexStorage.plugin],
    state: rootStore.state() as any,
    getters: rootStore.getters,
    mutations: rootStore.mutations,
    actions: rootStore.actions as any,
    modules: modules
      .map(s => Object.values(s) as any)
      .flat()
      .reduce((acc, module: any) => ({ ...acc, [module.name]: module }), {})
  });

  return store;
};

export default buildStore;
