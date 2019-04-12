import { State as AppState } from '../../';
import { authApi, AuthenticatePayload } from '../../../api/auth.api';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { AuthActions } from './types';

export interface Actions<S, R> extends ActionTree<S, R> {
  [AuthActions.LOGIN]: (context: ActionContext<S, R>, payload: any) => void;
  [AuthActions.LOGOUT]: (context: ActionContext<S, R>) => void;
}

export const actions: Actions<State, AppState> = {
  async [AuthActions.LOGIN]({ commit }, payload: AuthenticatePayload) {
    commit(AuthActions.SET_USER, {
      ...(await authApi.get(payload)).data,
      isLogged: true
    });
  },
  [AuthActions.LOGOUT]({ commit }) {
    commit(AuthActions.SET_USER, { username: '', email: '', isLogged: false });
  }
};
