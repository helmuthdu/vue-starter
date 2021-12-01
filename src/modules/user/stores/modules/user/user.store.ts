import { userApi, UserRequest } from '@/modules/user/api/user.api';
import { User, UserSchema } from '@/modules/user/entities/user';
import { Module } from 'vuex';
import { AppState } from '@/stores';

export enum ActionTypes {
  SET_STATE = 'USER/SET_STATE',
  SET_ENTITY = 'USER/SET_ENTITY',
  SET_STATUS = 'USER/SET_STATUS',
  SET_ERROR = 'USER/SET_ERROR'
}

enum RequestErrorType {
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UserNotFound = 'USER_NOT_FOUND',
  UserInvalid = 'USER_INVALID'
}

type Status = 'idle' | 'pending' | 'completed';

export type State = {
  entity: UserSchema;
  status: Status;
  error?: RequestErrorType;
};

export const initialState: State = {
  entity: User.create(),
  status: 'idle',
  error: undefined
};

export const store: Module<State, AppState> = {
  state: () => initialState,
  getters: {
    isLoggedIn: state => !!state.entity.token
  },
  actions: {
    async signUp({ commit }, payload: UserRequest) {
      commit(ActionTypes.SET_STATUS, 'pending' as Status);
      try {
        commit(ActionTypes.SET_STATE, {
          entity: User.create((await userApi.signUp(payload)).data),
          error: undefined,
          status: 'completed'
        } as State);
      } catch (err) {
        commit(ActionTypes.SET_STATE, {
          entity: User.create(),
          error: RequestErrorType.UserAlreadyExists,
          status: 'idle'
        } as State);
      }
    },
    async signIn({ commit }, payload: UserRequest) {
      commit(ActionTypes.SET_STATUS, 'pending' as Status);
      try {
        commit(ActionTypes.SET_STATE, {
          entity: User.create((await userApi.signIn(payload)).data),
          error: undefined,
          status: 'completed'
        } as State);
      } catch (err: any) {
        commit(ActionTypes.SET_STATE, {
          entity: User.create(),
          error: err.status === 409 ? RequestErrorType.UserNotFound : RequestErrorType.UserInvalid,
          status: 'idle'
        } as State);
      }
    },
    signOut({ commit }) {
      commit(ActionTypes.SET_STATE, {
        entity: User.create(),
        status: 'idle',
        error: undefined
      } as State);
    }
  },
  mutations: {
    [ActionTypes.SET_STATE](state: State, payload: State) {
      Object.assign(state, payload);
    },
    [ActionTypes.SET_ENTITY](state: State, payload: UserSchema) {
      Object.assign(state, { entity: payload });
    },
    [ActionTypes.SET_STATUS](state: State, payload: Status) {
      Object.assign(state, { status: payload });
    },
    [ActionTypes.SET_ERROR](state: State, payload: RequestErrorType) {
      Object.assign(state, { error: payload });
    }
  }
};
