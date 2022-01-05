/// <reference types="vite/client" />
import type { DeepReadonly, Ref } from 'vue';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.json' {
  const json: any;
  export default json;
}

type Primitive = string | number | boolean | undefined;

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

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

type ReadonlyObjectRef<T> = { [K in keyof T]: DeepReadonly<Ref<T[K]>> };
