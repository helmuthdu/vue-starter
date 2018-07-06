import { RootState } from '@/store';
import { GetterTree } from 'vuex';
import { State } from './state';
import { AUTHENTICATION_IS_LOGGED } from './types';

export const getters: GetterTree<State, RootState> = {
  [AUTHENTICATION_IS_LOGGED](state) {
    return state.isLogged;
  },
};
