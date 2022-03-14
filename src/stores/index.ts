import { State, stores } from '@/modules';
import { RootState, rootStore } from './root';
import { createLogger, createStore, useStore as baseUseStore } from 'vuex';

export type AppState = RootState & State;

export const store = createStore<AppState>({
  plugins: [createLogger()],
  state: rootStore.state as AppState,
  getters: rootStore.getters,
  mutations: rootStore.mutations,
  actions: rootStore.actions,
  modules: stores
});

export const useStore = () => baseUseStore();
