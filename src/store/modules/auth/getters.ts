import { RootState } from '@/store';
import { State } from '@/store/modules/auth/state';
import { GetterTree } from 'vuex';
import { AUTH_IS_LOGGED } from '@/store/modules/auth/types';

export const getters: GetterTree<State, RootState> = {
  [AUTH_IS_LOGGED](state) {
    return state.isLogged;
  },
};
