// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
import { Logger } from './logger.util';

export const type = (arg: any) => {
  if (arg === null) {
    return 'Null';
  } else if (arg === undefined) {
    return 'Undefined';
  } else if (Number.isNaN(arg)) {
    return 'NaN';
  }
  const type = Object.prototype.toString.call(arg).slice(8, -1);
  return type === 'AsyncFunction' ? 'Promise' : type;
};

export const isArray = Array.isArray;
export const isFunction = (arg: any) => type(arg) === 'Function';
export const isNil = (arg: any) => arg === undefined || arg === null;
export const isNumber = (arg: any) => type(arg) === 'Number';
export const isObject = (arg: any) => type(arg) === 'Object';
export const isPromise = (arg: any) => ['Async', 'Promise'].includes(type(arg));
export const isString = (arg: any) => type(arg) === 'String';
export const isEmpty = (arg: any) =>
  isNil(arg) || ((isArray(arg) || isObject(arg)) && !Object.entries(arg || {}).length);
export const isEquals = (curr: any, prev: any): boolean => {
  if (curr === prev) return true;

  if (type(curr) !== type(prev)) return false;

  if (isArray(curr)) {
    if (curr.toString() !== prev.toString()) return false;
    return !curr.some((val, idx) => val !== prev[idx] && !isEquals(val, prev[idx]));
  }

  if (isObject(curr)) {
    const keys = Object.keys(curr);
    if (keys.length !== Object.keys(prev).length) return false;
    return !keys.some(key => curr[key] !== prev[key] && !isEquals(curr[key], prev[key]));
  }

  return false;
};

// eslint-disable-next-line no-prototype-builtins
export const has = (data: any, prop: string) => data?.hasOwnProperty(prop);

export const get = <T, K extends keyof T>(data: T, path: K | string, defaultValue: unknown = null) =>
  String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((acc: any, cur: string) => (Object.hasOwnProperty.call(acc, cur) ? acc[cur] : defaultValue), data);

export const groupBy = <T extends object>(data: T | T[] | ReadonlyArray<T>, key: keyof T) =>
  isObject(data)
    ? Object.values(data).reduce(
        (acc: DictionaryArray<T>, val: T, idx: number, arr: T[] | ReadonlyArray<T>, prop = val[key]) =>
          (acc[prop] || (acc[prop] = [])).push(val),
        {}
      )
    : {};

export const sortBy = <T, K extends keyof T>(data: T[], key: K) =>
  [...data].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));

export const keyBy = <T extends object>(data: T | T[] | ReadonlyArray<T>, key: keyof T): Dictionary<T> =>
  isObject(data)
    ? Object.values(data).reduce(
        (acc: Dictionary<T>, val: T, idx: number, arr: T[] | ReadonlyArray<T>, prop = val[key]) => {
          if (!prop) return acc;
          acc[prop] = val;
          return acc;
        },
        {}
      )
    : {};

export const uniq = <T>(arg: T[]) => [...new Set(arg)];

export const flatten = <T>(arg: T | T[]) => (isArray(arg) ? arg.flat(Infinity) : arg);

export const keys = <T extends object, K extends keyof T>(arg: T) => (isObject(arg) ? (Object.keys(arg) as K[]) : []);

export const values = <T extends object, K extends keyof T>(arg: T) =>
  isObject(arg) ? (Object.values(arg) as T[K][]) : [];

export const entries = <T extends object, K extends keyof T>(arg: T) =>
  isObject(arg) ? (Object.entries(arg) as { [K in keyof T]: [K, T[K]] }[keyof T][]) : [];

export const compose = <R>(fn: (args: R) => R, ...fns: ((args: R) => R)[]) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn);

export const pipe =
  <T extends unknown[], R>(fn: (...args: T) => R, ...fns: ((args: R) => R)[]) =>
  (...args: T) =>
    fns.reduce(
      (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
      value => value
    )(fn(...args));

export const merge = <T extends Record<string, any>[]>(...args: [...T]): Spread<T> => {
  const target = args.shift();
  if (!target) return {} as any;
  const source = args.shift();
  if (!source) return target as any;
  entries(source).forEach(([key, val]) => {
    if (isObject(val)) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], val);
    } else {
      Object.assign(target, { [key]: val });
    }
  });
  return merge(target, ...args) as unknown as Spread<T>;
};

export const uuid = (): string => window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

export const parseJson = <T, K>(arg: K, defaultValue?: T): T | undefined => {
  try {
    const value = typeof arg === 'string' ? JSON.parse(arg) : arg;
    return value || defaultValue;
  } catch (err) {
    Logger.error('parseJson() -> failed to parse object', err);
    return defaultValue;
  }
};

export const toSnakeCase = (text: string) =>
  text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(s => s.toLowerCase())
    .join('_');

export const toKebabCase = (text: string) =>
  text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const truncate = (text: string, limit = 25, completeWords = false, ellipsis = '…'): string => {
  if (completeWords) {
    limit = text.substring(0, limit).lastIndexOf(' ');
  }
  return text.length > limit ? `${text.substring(0, limit)}${ellipsis}` : text;
};

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms = 0, immediate?: boolean) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: unknown[]): ReturnType<T> | void => {
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) {
        return fn(...args);
      }
    }, ms);
    if (callNow) {
      return fn(...args);
    }
  };
};

type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
type UnwrapPromisify<T> = T extends Promise<infer U> ? U : T;
export const tryit =
  <T extends (...args: any) => any>(fn: T) =>
  async (...args: ArgumentsType<T>): Promise<{ error?: Error; data?: UnwrapPromisify<ReturnType<T>> }> => {
    try {
      return { error: undefined, data: await fn(...(args as any)) };
    } catch (err) {
      return { error: err as Error, data: undefined };
    }
  };

export const nextTick = (fn: (...args: unknown[]) => void) => {
  const id = window.requestAnimationFrame(() => {
    fn?.();
    window.cancelAnimationFrame(id);
  });
};

export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sleep = async (fn: () => any, timer = 1000) => {
  await timeout(timer);
  return fn();
};
