import { MutationTree } from 'vuex';
import { State } from './state';
import { UserActionTypes } from './types';

export const mutations: MutationTree<State> = {
  [UserActionTypes.SET_USER](state: State, payload: State) {
    state.username = payload.username || '';
    state.email = payload.email || '';
    state.isLogged = payload.isLogged || false;
    state.token = payload.token || '';
  }
};
