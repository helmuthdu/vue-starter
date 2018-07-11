import { MutationTree } from 'vuex';
import { State } from './state';
import { AUTHENTICATION_SET_USER } from './types';

export const mutations: MutationTree<State> = {
  [AUTHENTICATION_SET_USER](state: State, payload: State) {
    state.username = payload.username;
    state.email = payload.email;
    state.isLogged = payload.isLogged;
  },
};
