import { MutationTree } from 'vuex';
import { State } from './state';
import { UserActionTypes } from './types';

export const mutations: MutationTree<State> = {
  [UserActionTypes.SET_USER](state: State, payload: State) {
    state = Object.assign({}, state, payload);
  },
  [UserActionTypes.DEL_USER](state: State) {
    Object.keys(state).forEach(key => {
      (state as any)[key] = null;
    });
  }
};
