import { State as AppState } from '../../..';
import { userApi, AuthenticatePayload } from '../../../api/user.api';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { UserActionTypes } from './types';

export interface Actions<S, R> extends ActionTree<S, R> {
  [UserActionTypes.SIGN_IN]: (context: ActionContext<S, R>, payload: any) => void;
  [UserActionTypes.SIGN_OUT]: (context: ActionContext<S, R>) => void;
}

export const actions: Actions<State, AppState> = {
  async [UserActionTypes.SIGN_IN]({ commit }, payload: AuthenticatePayload) {
    commit(UserActionTypes.SET_USER, {
      ...(await userApi.get(payload)).data,
      isLogged: true
    });
  },
  [UserActionTypes.SIGN_OUT]({ commit }) {
    commit(UserActionTypes.DEL_USER);
  }
};
