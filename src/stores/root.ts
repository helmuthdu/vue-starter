import { StoreOptions } from 'vuex';

export interface RootState {
  version: string;
}

export const state: () => RootState = () => ({
  version: '1.0.0'
});

export const rootStore: StoreOptions<RootState> = {
  state: () => ({
    version: '1.0.0'
  }),
  getters: {},
  mutations: {},
  actions: {
    getVersion({ state }) {
      return state.version;
    }
  }
};
