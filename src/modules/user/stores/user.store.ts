import { type UserRequest, userApi } from '@/modules/user/api/user.api';
import { User, type UserJSON } from '@/modules/user/models/user';
import { defineStore } from 'pinia';

enum RequestErrorType {
  AlreadyExists = 'ALREADY_EXISTS',
  NotFound = 'NOT_FOUND',
  Invalid = 'INVALID',
}

export type State = {
  data: UserJSON;
  status: 'idle' | 'pending' | 'completed';
  error?: RequestErrorType;
};

export type Getter = {
  isLoggedIn(state: State): boolean;
};

export type Action = {
  signIn(payload: UserRequest): Promise<void>;
  signUp(payload: UserRequest): Promise<void>;
  signOut(): void;
};

export type Name = typeof name;

export const name = 'user' as const;

export const useStore = defineStore<Name, State, Getter, Action>(name, {
  state: () => ({
    data: User.create(),
    status: 'idle',
    error: undefined,
  }),
  actions: {
    async signUp(payload: UserRequest) {
      this.$patch({ status: 'pending' });

      try {
        this.$patch({
          data: User.create((await userApi.signUp(payload)).data),
          status: 'completed',
          error: undefined,
        });
        // biome-ignore lint/suspicious/noExplicitAny: axios error handling
      } catch (err: any) {
        this.$patch({
          data: User.create(),
          status: 'idle',
          error: RequestErrorType.AlreadyExists,
        });
      }
    },
    async signIn(payload: UserRequest) {
      this.$patch({ status: 'pending' });

      try {
        this.$patch({
          data: User.create((await userApi.signIn(payload)).data),
          status: 'completed',
          error: undefined,
        });
        // biome-ignore lint/suspicious/noExplicitAny: axios error handling
      } catch (err: any) {
        this.$patch({
          data: User.create(),
          status: 'idle',
          error: err.status === 409 ? RequestErrorType.NotFound : RequestErrorType.Invalid,
        });
      }
    },
    signOut() {
      this.$reset();
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.data.token,
  },
});
