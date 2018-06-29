import { State } from '@/store/modules/auth/state';
import { AUTH_SET_USER } from '@/store/modules/auth/types';
import { MutationTree } from 'vuex';

export const mutations: MutationTree<State> = {
  [AUTH_SET_USER](state: State, payload: State) {
    state.username = payload.username;
    state.email = payload.email;
    state.isLogged = payload.isLogged;
  },
};
