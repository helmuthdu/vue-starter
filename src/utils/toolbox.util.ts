// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
import { Logger } from '@/utils/logger.util';

export const type = (val: any) => {
  if (val === null) {
    return 'Null';
  } else if (val === undefined) {
    return 'Undefined';
  } else if (Number.isNaN(val)) {
    return 'NaN';
  }
  const type = Object.prototype.toString.call(val).slice(8, -1);
  return type === 'AsyncFunction' ? 'Promise' : type;
};

export const isArray = Array.isArray;
export const isEmpty = (val: any) => (isArray(val) || isObject(val)) && !Object.entries(val || {}).length;
export const isFunction = (val: any) => type(val) === 'Function';
export const isNil = (val: any) => val === undefined || val === null;
export const isNumber = (val: any) => type(val) === 'Number';
export const isObject = (val: any) => type(val) === 'Object';
export const isPromise = (val: any) => ['Async', 'Promise'].includes(type(val));
export const isString = (val: any) => type(val) === 'String';
export const isEquals = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (type(a) !== type(b)) return false;

  if (isArray(a)) {
    if (a.toString() !== b.toString()) return false;
    return !a.some((val, idx) => val !== b[idx] && !isEquals(val, b[idx]));
  }

  if (isObject(a)) {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return !keys.some(key => a[key] !== b[key] && !isEquals(a[key], b[key]));
  }

  return false;
};

export const has = (val: any, prop: string) => val?.hasOwnProperty(prop);

export const get = <T, K extends keyof T>(obj: T, path: K | string, defaultValue: unknown = null) =>
  String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((acc: any, cur: string) => (Object.hasOwnProperty.call(acc, cur) ? acc[cur] : defaultValue), obj);

export const groupBy = <T>(list: T | T[] | ReadonlyArray<T>, key: keyof T) =>
  Object.values(list).reduce(
    (acc: DictionaryArray<T>, val: T, idx: number, arr: T[] | ReadonlyArray<T>, prop = val[key]) =>
      (acc[prop] || (acc[prop] = [])).push(val),
    {}
  );

export const sortBy = <T, K extends keyof T>(arr: T[], key: K) =>
  [...arr].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));

export const keyBy = <T>(list: T | T[] | ReadonlyArray<T>, key: keyof T): Dictionary<T> =>
  Object.values(list).reduce(
    (acc: Dictionary<T>, val: T, idx: number, arr: T[] | ReadonlyArray<T>, prop = val[key]) => {
      if (!prop) return acc;
      acc[prop] = val;
      return acc;
    },
    {}
  );

export const uniq = (arr: number[]) => [...new Set(arr)];
export const flatten = <T>(list: T | T[]) => (isArray(list) ? list.flat(Infinity) : list);

export const keys = <T, K extends keyof T>(obj: T) => Object.keys(obj) as K[];
export const values = <T, K extends keyof T>(obj: T) => Object.values(obj) as T[K][];
export const entries = <T, K extends keyof T>(obj: T) =>
  Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][];

export const compose = <R>(fn: (args: R) => R, ...fns: ((args: R) => R)[]) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn);

export const pipe =
  <T extends unknown[], R>(fn: (...args: T) => R, ...fns: ((args: R) => R)[]) =>
  (...args: T) =>
    fns.reduce(
      (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
      value => value
    )(fn(...args));

export const merge = <T extends Record<string, any>[]>(...obj: [...T]): Spread<T> => {
  const target = obj.shift();
  if (!target) return {} as any;
  const source = obj.shift();
  if (!source) return target as any;
  entries(source).forEach(([key, val]) => {
    if (isObject(val)) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], val);
    } else {
      Object.assign(target, { [key]: val });
    }
  });
  return merge(target, ...obj) as unknown as Spread<T>;
};

export const toSnakeCase = (str: string) =>
  str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(s => s.toLowerCase())
    .join('_');

export const toKebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const uuid = (): string => window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

export const jsonParse = <T, K>(data: K, property?: keyof K): T | undefined => {
  try {
    const value = property ? data[property] : data;
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (err) {
    Logger.error('jsonParse() -> failed to parse object', err);
    return undefined;
  }
};
