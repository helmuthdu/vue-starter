import { authApi } from '@/api/auth.api';
import { AppState } from '@/main';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { AUTHENTICATION_LOGIN, AUTHENTICATION_LOGOUT, AUTHENTICATION_SET_USER } from './types';

export interface Actions<S, R> extends ActionTree<S, R> {
  [AUTHENTICATION_LOGIN]: (context: ActionContext<S, R>, payload: any) => void;
  [AUTHENTICATION_LOGOUT]: (context: ActionContext<S, R>) => void;
}

export const actions: Actions<State, AppState> = {
  async [AUTHENTICATION_LOGIN]({ commit }, payload: State) {
    commit(AUTHENTICATION_SET_USER, {
      ...(await authApi.get(payload)).data,
      isLogged: true
    });
  },
  [AUTHENTICATION_LOGOUT]({ commit }) {
    commit(AUTHENTICATION_SET_USER, { username: '', email: '', isLogged: false });
  }
};
