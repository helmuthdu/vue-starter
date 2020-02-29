import { MutationTree } from 'vuex';
import { State, initialState } from './state';
import { UserActionTypes } from './types';

export const mutations: MutationTree<State> = {
  [UserActionTypes.SET_USER](state: State, payload: State) {
    Object.assign(state, payload);
  },
  [UserActionTypes.DEL_USER](state: State) {
    Object.assign(state, initialState);
  }
};
