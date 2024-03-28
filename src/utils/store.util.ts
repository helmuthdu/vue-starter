import { useStore as toRef } from '@nanostores/vue';
import { computed, map, MapStore } from 'nanostores';
import type { DeepReadonly, Ref } from 'vue';
import { getStorageItem, setStorageItem } from '@/utils';

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

type NanoStore<State, Actions, Getters> = {
  state: State;
  actions: Actions;
  getters: Getters;
};

export const defineStore = <
  State extends object,
  Actions extends Record<string, (store: MapStore, ...payload: any[]) => Promise<void> | void>,
  Getters extends Record<string, (state: any) => any>,
>(
  name: string,
  store: NanoStore<State, Actions, Getters>,
) => {
  const state = map<State>(getStorageItem<State>(name, store.state));

  return {
    state,
    actions: Object.entries(store.actions).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: async (...payload: any) => {
          await fn(state, ...payload);
          setStorageItem<State>(name, state.get());
        },
      }),
      {},
    ) as { [K in keyof Actions]: OmitFirstArg<(...payload: Parameters<Actions[K]>) => Promise<void>> },
    getters: Object.entries(store.getters).reduce((acc, [key, fn]) => ({ ...acc, [key]: computed(state, fn) }), {}) as {
      [K in keyof Getters]: ReturnType<Getters[K]>;
    },
  };
};

export const createUseStore = <
  State extends MapStore,
  Actions extends { [K in keyof Actions]: Actions[K] },
  Getters extends { [K in keyof Getters]: Getters[K] },
>(
  store: NanoStore<State, Actions, Getters>,
) => {
  const _store = {
    state: toRef(store.state),
    getters: Object.entries(store.getters).reduce(
      (acc, [key, val]) => ({
        ...acc,
        [key]: toRef(val as any),
      }),
      {},
    ) as {
      [K in keyof Getters]: DeepReadonly<Ref<ReturnType<Getters[K]>>>;
    },
    actions: store.actions,
  };

  return () => _store;
};

export * from 'nanostores';
