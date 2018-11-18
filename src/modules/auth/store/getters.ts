import { AppState } from '@/main';
import { GetterTree } from 'vuex';
import { State } from './state';
import { AUTHENTICATION_IS_LOGGED } from './types';

export const getters: GetterTree<State, AppState> = {
  [AUTHENTICATION_IS_LOGGED](state) {
    return state.isLogged;
  },
};
