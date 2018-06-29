import { RootState } from '@/store';
import { State } from '@/store/modules/auth/state';
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_SET_USER } from '@/store/modules/auth/types';
import axios from 'axios';
import qs from 'qs';
import { ActionContext, ActionTree } from 'vuex';

export interface Actions<S, R> extends ActionTree<S, R> {
  [AUTH_LOGIN]: (context: ActionContext<S, R>, payload: any) => void;
  [AUTH_LOGOUT]: (context: ActionContext<S, R>) => void;
}

export const actions: Actions<State, RootState> = {
  async [AUTH_LOGIN]({ commit }, payload: State) {
    commit(AUTH_SET_USER, {
      ...(await axios.post(`https://httpstat.us/200`, qs.stringify({
        username: payload.email,
        password: payload.password,
      }))).data,
      isLogged: true,
    });
  },
  [AUTH_LOGOUT]({ commit }) {
    commit(AUTH_SET_USER,
      { username: '', email: '', isLogged: false });
  },
};
