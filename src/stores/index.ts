import { State, stores } from '@/modules';
import { RootState, rootStore } from './root';
import { InjectionKey } from 'vue';
import { createLogger, createStore, Store, useStore as baseUseStore } from 'vuex';

export type AppState = RootState & State;

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<AppState>({
  plugins: [createLogger()],
  state: rootStore.state as AppState,
  getters: rootStore.getters,
  mutations: rootStore.mutations,
  actions: rootStore.actions,
  modules: stores
});

export const useStore = () => baseUseStore(key);
