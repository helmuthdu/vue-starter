import { State as AppState } from '../../';
import { userApi, AuthenticatePayload } from '../../../api/user.api';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { UserActionTypes } from './types';

export interface Actions<S, R> extends ActionTree<S, R> {
  [UserActionTypes.LOGIN]: (context: ActionContext<S, R>, payload: any) => void;
  [UserActionTypes.LOGOUT]: (context: ActionContext<S, R>) => void;
}

export const actions: Actions<State, AppState> = {
  async [UserActionTypes.LOGIN]({ commit }, payload: AuthenticatePayload) {
    commit(UserActionTypes.SET_USER, {
      ...(await userApi.get(payload)).data,
      isLogged: true
    });
  },
  [UserActionTypes.LOGOUT]({ commit }) {
    commit(UserActionTypes.SET_USER, { username: '', email: '', isLogged: false });
  }
};
