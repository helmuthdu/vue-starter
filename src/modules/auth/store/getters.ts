import { AppState } from '@/main';
import { GetterTree } from 'vuex';
import { State } from './state';
import { AuthActions } from './types';

export interface Getters<S, R> extends GetterTree<S, R> {
  [AuthActions.IS_LOGGED]: (state: S) => boolean;
}

export const getters: Getters<State, AppState> = {
  [AuthActions.IS_LOGGED](state) {
    return state.isLogged;
  },
};
