import type { MapStore } from 'nanostores';
import { userApi, UserRequest } from '@/modules/user/api/user.api';
import { User, UserSchema } from '@/modules/user/entities/user';
import { createUseStore, defineStore } from '@/utils/store.util.ts';

export const name = 'user' as const;

enum RequestErrorType {
  AlreadyExists = 'ALREADY_EXISTS',
  NotFound = 'NOT_FOUND',
  Invalid = 'INVALID',
}

type State = {
  data: UserSchema;
  status: 'idle' | 'pending' | 'completed';
  error?: RequestErrorType;
};

const state = {
  data: User.create(),
  status: 'idle',
  error: undefined,
};

export const getters = {
  isLoggedIn: (state: State) => !!state.data.token,
};

export const actions = {
  signUp: async (store: MapStore<State>, payload: UserRequest) => {
    store.setKey('status', 'pending');

    try {
      store.set({
        data: User.create((await userApi.signUp(payload)).data),
        status: 'completed',
        error: undefined,
      });
    } catch (err) {
      store.set({
        data: User.create(),
        status: 'idle',
        error: RequestErrorType.AlreadyExists,
      });
    }
  },
  signIn: async (store: MapStore<State>, payload: UserRequest) => {
    store.setKey('status', 'pending');

    try {
      store.set({
        data: User.create((await userApi.signIn(payload)).data),
        status: 'completed',
        error: undefined,
      });
    } catch (err: any) {
      store.set({
        data: User.create(),
        status: 'idle',
        error: err.status === 409 ? RequestErrorType.NotFound : RequestErrorType.Invalid,
      });
    }
  },
  signOut: (store: MapStore<State>) => {
    store.set({
      data: User.create(),
      status: 'idle',
      error: undefined,
    });
  },
};

export const store = defineStore(name, {
  state,
  actions,
  getters,
});

export const useStore = createUseStore(store);
