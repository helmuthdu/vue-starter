/* eslint-disable */
import { DeepReadonly, Ref } from 'vue';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.json' {
  const json: any;
  export default json;
}

type ValueOf<T> = T[keyof T];

type Nullable<T> = T | null;

type Dictionary<T> = Record<T[keyof T] | keyof T | string, T | T[keyof T] | any>;

type DictionaryArray<T> = Record<T[keyof T] | keyof T | string, T[] | any[]>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>;
};

type Getters<T> = { [K in keyof T]: DeepReadonly<Ref<T[K]>> };

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
