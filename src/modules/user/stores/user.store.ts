import { userApi, UserRequest } from '@/modules/user/api/user.api';
import { User, UserSchema } from '@/modules/user/entities/user';
import { action, computed, map } from 'nanostores';
import { useStore as _useStore } from '@nanostores/vue/use-store';
import { Getters } from '@/shims-vue';

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

const _state = map<State>({
  entity: {} as UserSchema,
  status: 'idle',
  error: undefined
});

export const actions = {
  signUp: action(_state, 'signUp', async (store, payload: UserRequest) => {
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
  signIn: action(_state, 'signIn', async (store, payload: UserRequest) => {
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
  signOut: action(_state, 'signOut', store => {
    store.set({
      entity: {} as UserSchema,
      status: 'idle',
      error: undefined
    });
    return store.get();
  })
};

export const getters = {
  isLoggedIn: computed(_state, state => !!state.entity.token),
  getEmail: computed(_state, state => state.entity.email)
};

export const useStore = () => ({
  state: _useStore(_state),
  ...Object.entries(getters).reduce(
    (acc, [key, val]) => ({ ...acc, [key]: _useStore(val) }),
    {} as Getters<typeof getters>
  ),
  ...actions
});
