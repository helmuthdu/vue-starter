import { type UserRequestPayload, userApi } from '@/modules/user/api/user.api';
import { User, type UserJSON } from '@/modules/user/models/user';
import { RequestErrorType, RequestStatus } from '@/utils/http.util';
import { getStorageItem } from '@/utils/storage.util';
import { createStore, createUseStore } from '@/utils/store.util';
import { computed, map, task } from 'nanostores';

type State = {
  data: UserJSON;
  status: RequestStatus;
  error?: RequestErrorType;
};

export const name = 'user' as const;

const initialState: State = getStorageItem<State>(name, {
  defaultValue: {
    data: User.create(),
    status: RequestStatus.PENDING,
    error: undefined,
  } satisfies State,
  parser: (state) => ({
    ...state,
    data: User.create(state.data),
  }),
});

const state = map<State>(initialState);

const getters = Object.freeze({
  isLoggedIn: computed(state, (s) => !!s.data.token),
  isPending: computed(state, (s) => s.status === RequestStatus.PENDING),
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
});

const actions = Object.freeze({
  signUp: async (payload: UserJSON) => {
    state.setKey('status', RequestStatus.PENDING);

    try {
      state.set({
        data: User.create((await userApi.signUp(payload)).data),
        status: RequestStatus.SUCCESS,
        error: undefined,
      });
      // biome-ignore lint/suspicious/noExplicitAny: AxiosError
    } catch (err: any) {
      state.set({
        data: User.create(),
        status: RequestStatus.ERROR,
        error: err.status === 409 ? RequestErrorType.CONFLICT : RequestErrorType.BAD_REQUEST,
      });
    }
  },
  signIn: async (payload: UserRequestPayload) => {
    state.setKey('status', RequestStatus.PENDING);

    try {
      state.set({
        data: User.create((await userApi.signIn(payload)).data),
        status: RequestStatus.SUCCESS,
        error: undefined,
      });
      // biome-ignore lint/suspicious/noExplicitAny: AxiosError
    } catch (err: any) {
      state.set({
        data: User.create(),
        status: RequestStatus.ERROR,
        error: err.status === 409 ? RequestErrorType.CONFLICT : RequestErrorType.NOT_FOUND,
      });
    }
  },
  signOut: () => {
    state.set({
      data: User.create(),
      status: RequestStatus.SUCCESS,
      error: undefined,
    });
  },
});

export const userStore = createStore(name, { state, actions, getters });

export const useUserStore = createUseStore({ state, actions, getters });
