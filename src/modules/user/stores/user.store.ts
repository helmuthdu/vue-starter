import { type UserRequestPayload, userApi } from '@/modules/user/api/user.api';
import { User, type UserJSON } from '@/modules/user/models/user';
import { Logger } from '@/utils/logger.util';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';
import { clone, diff } from '@/utils/toolbox.util.ts';
import { useStore as toRef } from '@nanostores/vue';
import { computed, map, task } from 'nanostores';

enum RequestErrorType {
  AlreadyExists = 'ALREADY_EXISTS',
  NotFound = 'NOT_FOUND',
  Invalid = 'INVALID',
}

type State = {
  data: UserJSON;
  status: 'pending' | 'success' | 'error';
  error?: RequestErrorType;
};

export const name = 'user' as const;

export const initialState: State = getStorageItem<State>(
  name,
  {
    data: User.create(),
    status: 'pending',
    error: undefined,
  } satisfies State,
  (state) => ({
    ...state,
    data: User.create(state.data),
  }),
);

const state = map<State>(initialState);

state.subscribe((curr, prev) => {
  Logger.groupCollapsed(name, 'NANOSTORE');
  Logger.debug('PREV_STATE', clone(prev));
  Logger.debug('CURR_STATE', clone(curr));
  Logger.debug('STATE_DIFF', diff(prev ?? {}, curr));
  Logger.groupEnd();

  setStorageItem(name, curr);
});

const getters = {
  isLoggedIn: computed(state, (s) => !!s.data.token),
  isRegistered: computed(state, () =>
    task(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(false);
          }, 1000);
        }),
    ),
  ),
};

const actions = {
  signUp: async (payload: UserRequestPayload) => {
    state.setKey('status', 'pending');

    try {
      state.set({
        data: User.create((await userApi.signUp(payload)).data),
        status: 'success',
        error: undefined,
      });
    } catch (err) {
      state.set({
        data: User.create(),
        status: 'error',
        error: RequestErrorType.AlreadyExists,
      });
    }
  },
  signIn: async (payload: UserRequestPayload) => {
    state.setKey('status', 'pending');

    try {
      state.set({
        data: User.create((await userApi.signIn(payload)).data),
        status: 'success',
        error: undefined,
      });
      // biome-ignore lint/suspicious/noExplicitAny: axios error handling
    } catch (err: any) {
      state.set({
        data: User.create(),
        status: 'error',
        error: err.status === 409 ? RequestErrorType.NotFound : RequestErrorType.Invalid,
      });
    }
  },
  signOut: () => {
    state.set({
      data: User.create(),
      status: 'success',
      error: undefined,
    });
  },
};

export const store = {
  user: state,
  ...getters,
  ...actions,
};

export const useStore = () => ({
  user: toRef(state),
  isLoggedIn: toRef(getters.isLoggedIn),
  isRegistered: toRef(getters.isRegistered),
  ...actions,
});
