import { State, stores } from '@/modules';
import localForage from 'localforage';
import { InjectionKey } from 'vue';
import { createLogger, createStore, Store } from 'vuex';
import VuexPersist from 'vuex-persist';
import { RootState, rootStore } from './root';

export type AppState = RootState & State;

export const storeKey: InjectionKey<Store<AppState>> = Symbol();

export let store: Store<AppState>;

export const buildStore = (): Store<AppState> => {
  const vuexStorage = new VuexPersist({
    key: 'snapshot',
    storage: localForage as any
  });

  store = createStore<AppState>({
    plugins: [vuexStorage.plugin, createLogger()],
    state: rootStore.state as any,
    getters: rootStore.getters,
    mutations: rootStore.mutations,
    actions: rootStore.actions,
    modules: stores
  });

  return store;
};
