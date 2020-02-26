import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

type ValueOf<T> = T[keyof T];

type Nullable<T> = T | null;

// eslint-disable-next-line
type Dictionary<T> = Record<T[keyof T] | keyof T | string, T | T[keyof T] | any>;

// eslint-disable-next-line
type DictionaryArray<T> = Record<T[keyof T] | keyof T | string, T[] | any[]>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>;
};
