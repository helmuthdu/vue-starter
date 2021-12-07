import { userApi, UserRequest } from '@/modules/user/api/user.api';
import { User, UserSchema } from '@/modules/user/entities/user';
import { action, computed, map } from 'nanostores';
import { useStore } from '@nanostores/vue/use-store';

enum RequestErrorType {
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UserNotFound = 'USER_NOT_FOUND',
  UserInvalid = 'USER_INVALID'
}

export type State = {
  entity: UserSchema;
  status: 'idle' | 'pending';
  error?: RequestErrorType;
};

export const state = map<State>({
  entity: {} as UserSchema,
  status: 'idle',
  error: undefined
});

export const actions = {
  signUp: action(state, 'signUp', async (store, payload: UserRequest) => {
    store.setKey('status', 'pending');
    try {
      store.set({
        entity: User.create((await userApi.signUp(payload)).data),
        status: 'idle',
        error: undefined
      });
    } catch (err) {
      store.set({
        entity: {} as UserSchema,
        status: 'idle',
        error: RequestErrorType.UserAlreadyExists
      });
    }
    return store.get();
  }),
  signIn: action(state, 'signIn', async (store, payload: UserRequest) => {
    store.setKey('status', 'pending');
    try {
      store.set({
        entity: User.create((await userApi.signIn(payload)).data),
        status: 'idle',
        error: undefined
      });
    } catch (err: any) {
      store.set({
        entity: {} as UserSchema,
        status: 'idle',
        error: err.status === 409 ? RequestErrorType.UserNotFound : RequestErrorType.UserInvalid
      });
    }
    return store.get();
  }),
  signOut: action(state, 'signOut', store => {
    store.set({
      entity: {} as UserSchema,
      status: 'idle',
      error: undefined
    });
    return store.get();
  })
};

export const getters = {
  isLoggedIn: computed(state, _state => !!_state.entity.token)
};

export const getStore = () => ({
  state: useStore(state),
  ...actions,
  ...getters
});
