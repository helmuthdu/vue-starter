import { AppState } from '../main';
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';

export interface RootState {
  version: string;
}

export const state = (): RootState => ({
  version: '1.0.0'
});

export const getters: GetterTree<RootState, AppState> = {};

export interface Actions<S, R> extends ActionTree<S, R> {
  getVersion(context: ActionContext<S, R>): void;
}

export const actions: Actions<RootState, AppState> = {
  async getVersion(context: ActionContext<RootState, AppState>) {
    return context.state.version;
  }
};

export const mutations: MutationTree<RootState> = {};

export const rootStore = {
  state,
  getters,
  mutations,
  actions
};
