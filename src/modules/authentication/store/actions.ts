import { RootState } from '@/store';
import axios from 'axios';
import qs from 'qs';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import {
  AUTHENTICATION_LOGIN,
  AUTHENTICATION_LOGOUT,
  AUTHENTICATION_SET_USER,
} from './types';

export interface Actions<S, R> extends ActionTree<S, R> {
  [AUTHENTICATION_LOGIN]: (context: ActionContext<S, R>, payload: any) => void;
  [AUTHENTICATION_LOGOUT]: (context: ActionContext<S, R>) => void;
}

export const actions: Actions<State, RootState> = {
  async [AUTHENTICATION_LOGIN]({ commit }, payload: State) {
    commit(AUTHENTICATION_SET_USER, {
      ...(await axios.post(`https://httpstat.us/200`, qs.stringify({
        username: payload.email,
        password: payload.password,
      }))).data,
      isLogged: true,
    });
  },
  [AUTHENTICATION_LOGOUT]({ commit }) {
    commit(AUTHENTICATION_SET_USER,
      { username: '', email: '', isLogged: false });
  },
};
