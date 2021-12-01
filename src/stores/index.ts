import { State, stores } from '@/modules';
import { createLogger, createStore } from 'vuex';
import { RootState, rootStore } from './root';

export type AppState = RootState & State;

export const store = createStore<AppState>({
  plugins: [createLogger()],
  state: rootStore.state as AppState,
  getters: rootStore.getters,
  mutations: rootStore.mutations,
  actions: rootStore.actions,
  modules: stores
});
