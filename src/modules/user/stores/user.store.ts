import { userApi, UserRequest } from '@/modules/user/api/user.api';
import { User, UserSchema } from '@/modules/user/entities/user';
import { defineStore } from 'pinia';

enum RequestErrorType {
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UserNotFound = 'USER_NOT_FOUND',
  UserInvalid = 'USER_INVALID'
}

export type State = {
  entity: UserSchema;
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

const name = 'user' as const;

export const useStore = defineStore<Name, State, Getter, Action>(name, {
  state: () => ({
    entity: User.create(),
    status: 'idle',
    error: undefined
  }),
  getters: {
    isLoggedIn: state => !!state.entity.token
  },
  actions: {
    async signUp(payload: UserRequest) {
      this.status = 'pending';
      try {
        this.entity = User.create((await userApi.signUp(payload)).data);
        this.error = undefined;
        this.status = 'completed';
      } catch (err) {
        this.entity = User.create();
        this.status = 'idle';
        this.error = RequestErrorType.UserAlreadyExists;
      }
    },
    async signIn(payload: UserRequest) {
      this.status = 'pending';
      try {
        this.entity = User.create((await userApi.signIn(payload)).data);
        this.error = undefined;
        this.status = 'completed';
      } catch (err: any) {
        this.entity = User.create();
        this.status = 'idle';
        switch (err.status) {
          case 409:
            this.error = RequestErrorType.UserNotFound;
            break;
          default:
            this.error = RequestErrorType.UserInvalid;
            break;
        }
      }
    },
    signOut() {
      this.$reset();
    }
  }
});
