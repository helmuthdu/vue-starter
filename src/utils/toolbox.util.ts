// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
import { Logger } from './logger.util';

// FUNCTIONS

export function typeOf(arg: any) {
  if (arg === null) {
    return 'Null';
  } else if (arg === undefined) {
    return 'Undefined';
  } else if (Number.isNaN(arg)) {
    return 'NaN';
  }
  const type = Object.prototype.toString.call(arg).slice(8, -1);
  return type === 'AsyncFunction' ? 'Promise' : type;
}

export const isArray = Array.isArray;

export function isFunction(arg: any) {
  return typeOf(arg) === 'Function';
}

export function isNil(arg: any) {
  return arg === undefined || arg === null;
}

export function isNumber(arg: any) {
  return typeOf(arg) === 'Number';
}

export function isObject(arg: any) {
  return typeOf(arg) === 'Object';
}

export function isPromise(arg: any) {
  return ['Async', 'Promise'].includes(typeOf(arg));
}

export function isString(arg: any) {
  return typeOf(arg) === 'String';
}

export function isEmpty(arg: any) {
  return isNil(arg) || ((isArray(arg) || isObject(arg)) && !Object.entries(arg || {}).length);
}

export function isEquals(curr: any, prev: any): boolean {
  if (curr === prev) return true;

  if (typeOf(curr) !== typeOf(prev)) return false;

  if (isArray(curr)) {
    if (curr.toString() !== prev.toString()) return false;
    return !curr.some((val: any, idx: number) => val !== prev[idx] && !isEquals(val, prev[idx]));
  }

  if (isObject(curr)) {
    const keys = Object.keys(curr);
    if (keys.length !== Object.keys(prev).length) return false;
    return !keys.some((key) => curr[key] !== prev[key] && !isEquals(curr[key], prev[key]));
  }

  return false;
}

type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
type UnwrapPromisify<T> = T extends Promise<infer U> ? U : T;
type AttemptResponse<T extends (...args: any) => any> = UnwrapPromisify<ReturnType<T>>;

export async function attempt<T extends (...args: any) => any>(fn: T, ...args: ArgumentsType<T>) {
  if (arguments.length === 1) {
    return (..._args: ArgumentsType<T>) => attempt(fn, ..._args);
  }

  try {
    return (await fn(...(args as any))) as AttemptResponse<T>;
  } catch (err) {
    Logger.error('attempt() -> unexpected error', err);
    return undefined;
  }
}

export function observe<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fn: (target: T, prop: K, value: T[K], oldValue: T[K]) => void,
) {
  return new Proxy(obj, {
    set(target, prop, val, receiver) {
      fn(target, prop as K, val, target[prop as K]);

      return Reflect.set(target, prop, val, receiver);
    },
  });
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 300, immediate?: boolean) {
  let callback: NodeJS.Timeout | undefined;

  return (...args: unknown[]): ReturnType<T> | void => {
    if (immediate && !callback) {
      fn(...args);
    }
    clearTimeout(callback);
    callback = setTimeout(() => {
      callback = undefined;
      if (!immediate) {
        fn(...args);
      }
    }, ms);
  };
}

export function predict(fn: (...args: any) => any, ms = 7000) {
  return Promise.race([fn, new Promise((_, reject) => setTimeout(reject, ms))]);
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function delay(fn: () => any, ms = 700) {
  await timeout(ms);
  return Promise.resolve(fn());
}

export function uuid(): string {
  return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

export function parseJSON<T, K>(json?: K, defaultValue?: T): T | undefined {
  try {
    const value = typeof json === 'string' ? JSON.parse(json) : json;
    return value ?? defaultValue;
  } catch (err) {
    Logger.error('parseJSON() -> failed to parse object', err);
    return defaultValue;
  }
}

export function compose<R>(fn: (args: R) => R, ...fns: ((args: R) => R)[]) {
  return fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn);
}

export function pipe<T extends unknown[], R>(fn: (...args: T) => R, ...fns: ((args: R) => R)[]) {
  return (...args: T) =>
    fns.reduce(
      (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
      (value) => value,
    )(fn(...args));
}

// OBJECTS

export function has(data: any, prop: string) {
  // eslint-disable-next-line no-prototype-builtins
  return data?.hasOwnProperty(prop);
}

export function get<T, K extends keyof T>(data: T, path: K | string, defaultValue: unknown = undefined) {
  return String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((acc: any, cur: string) => (Object.hasOwnProperty.call(acc, cur) ? acc[cur] : defaultValue), data);
}

export function groupBy<T extends object>(data: T | T[] | ReadonlyArray<T>, key: keyof T) {
  return isObject(data)
    ? Object.values(data).reduce(
        (acc: DictionaryArray<T>, val: T, idx: number, arr: T[] | ReadonlyArray<T>, prop = val[key]) =>
          (acc[prop] || (acc[prop] = [])).push(val),
        {},
      )
    : {};
}

export function sortBy<T, K extends keyof T>(data: T[], key: K) {
  return [...data].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
}

export function keyBy<T extends object>(data: T | T[] | ReadonlyArray<T>, key: keyof T): Dictionary<T> {
  return isObject(data)
    ? Object.values(data).reduce(
        (acc: Dictionary<T>, val: T, idx: number, arr: T[] | ReadonlyArray<T>, prop = val[key]) => {
          if (!prop) return acc;
          acc[prop] = val;
          return acc;
        },
        {},
      )
    : {};
}

export function keys<T extends object, K extends keyof T>(arg: T) {
  return isObject(arg) ? (Object.keys(arg) as K[]) : [];
}

export function values<T extends object, K extends keyof T>(arg: T) {
  return isObject(arg) ? (Object.values(arg) as T[K][]) : [];
}

export function entries<T extends object, K extends keyof T>(arg: T) {
  return isObject(arg) ? (Object.entries(arg) as { [K in keyof T]: [K, T[K]] }[keyof T][]) : [];
}

export function merge<T extends Record<string, any>[]>(...args: [...T]): Spread<T> {
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
}

// ARRAYS

export function uniq<T>(arg: T[]) {
  return [...new Set(arg)];
}

export function flatten<T>(arg: T | T[]) {
  return isArray(arg) ? arg.flat(Infinity) : arg;
}

export function grade(min: number, max: number, steps: number) {
  const difference = max - min;
  const increment = difference / (steps - 1);
  return [
    min,
    ...Array(steps - 2)
      .fill(undefined)
      .map((_, idx) => min + increment * (idx + 1)),
    max,
  ];
}

export function range(start: number, stop: number, step: number) {
  return Array.from({ length: Math.floor((stop - start) / step) + 1 }, (_, i) => start + i * step);
}

// STRINGS

export function toSnakeCase(text: string) {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((s) => s.toLowerCase())
    .join('_');
}

export function toKebabCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function truncate(text: string, limit = 25, completeWords = false, ellipsis = '…'): string {
  if (completeWords) {
    limit = text.substring(0, limit).lastIndexOf(' ');
  }
  return text.length > limit ? `${text.substring(0, limit)}${ellipsis}` : text;
}
