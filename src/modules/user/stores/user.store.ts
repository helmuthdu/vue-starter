import { useStore as toRef } from '@nanostores/vue';
import { action, computed, map } from 'nanostores';
import type { DeepReadonly, Ref } from 'vue';
import { userApi, UserRequest } from '@/modules/user/api/user.api';
import { User, UserSchema } from '@/modules/user/entities/user';

type ReadonlyObjectRef<T> = { [K in keyof T]: DeepReadonly<Ref<T[K]>> };

enum RequestErrorType {
  AlreadyExists = 'ALREADY_EXISTS',
  NotFound = 'NOT_FOUND',
  Invalid = 'INVALID',
}

export type State = {
  entity: UserSchema;
  status: 'idle' | 'pending' | 'completed';
  error?: RequestErrorType;
};

export const state = map<State>({
  entity: User.create(),
  status: 'idle',
  error: undefined,
});

export const getters = {
  isLoggedIn: computed(state, (s) => !!s.entity.token),
};

export const actions = {
  signUp: action(state, 'signUp', async (store, payload: UserRequest) => {
    store.setKey('status', 'pending');

    try {
      store.set({
        entity: User.create((await userApi.signUp(payload)).data),
        status: 'completed',
        error: undefined,
      });
    } catch (err) {
      store.set({
        entity: User.create(),
        status: 'idle',
        error: RequestErrorType.AlreadyExists,
      });
    }

    return store.get();
  }),
  signIn: action(state, 'signIn', async (store, payload: UserRequest) => {
    store.setKey('status', 'pending');

    try {
      store.set({
        entity: User.create((await userApi.signIn(payload)).data),
        status: 'completed',
        error: undefined,
      });
    } catch (err: any) {
      store.set({
        entity: User.create(),
        status: 'idle',
        error: err.status === 409 ? RequestErrorType.NotFound : RequestErrorType.Invalid,
      });
    }

    return store.get();
  }),
  signOut: action(state, 'signOut', (store) => {
    store.set({
      entity: User.create(),
      status: 'idle',
      error: undefined,
    });

    return store.get();
  }),
};

export const useStore = () => ({
  state: toRef(state),
  ...Object.entries(getters).reduce(
    (acc, [key, val]) => ({ ...acc, [key]: toRef(val) }),
    {} as ReadonlyObjectRef<typeof getters>,
  ),
  ...actions,
});

export const store = {
  ...state,
  ...getters,
  ...actions,
};
