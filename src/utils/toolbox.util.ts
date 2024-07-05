// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
import { Logger } from './logger.util';

// TYPES

type OptionalPropertyNames<T> = { [K in keyof T]-?: object extends { [P in K]: T[K] } ? K : never }[keyof T];
type OptionalObject<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };
type Spread<L, R> = OptionalObject<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;
type Merge<A> = A extends [infer L, ...infer R] ? Spread<L, Merge<R>> : unknown;
type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type KeyBy<T extends Record<string, any>, K extends keyof T> = Record<T[K], T>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GroupBy<T extends Record<string, any>, K extends keyof T> = Record<T[K], T[]>;

// FUNCTIONS

/**
 * Returns the type of the given argument.
 *
 * @example
 *
 * typeOf(null); // returns 'Null'
 * typeOf(undefined); // returns 'Undefined'
 * typeOf(NaN); // returns 'NaN'
 * typeOf(async function() {}); // returns 'Promise'
 * typeOf(123); // returns 'Number'
 * typeOf('abc'); // returns 'String'
 * typeOf({}); // returns 'Object'
 * typeOf([]); // returns 'Array'
 * typeOf(() => {}); // returns 'Function'
 *
 * @param {any} arg - The argument whose type is to be determined.
 *
 * @returns {string} - The type of the argument. If the argument is a null, it returns 'Null'.
 * If the argument is undefined, it returns 'Undefined'. If the argument is NaN, it returns 'NaN'.
 * If the argument is an async function, it returns 'Promise'. Otherwise, it returns the actual type of the argument.
 */
export function typeOf(arg: unknown) {
  if (arg === null) {
    return 'Null';
  }
  if (arg === undefined) {
    return 'Undefined';
  }
  if (Number.isNaN(arg)) {
    return 'NaN';
  }

  const type = Object.prototype.toString.call(arg).slice(8, -1);

  return type === 'AsyncFunction' ? 'Promise' : type;
}

/**
 * Determines if the passed value is an Array.
 *
 * @example
 *
 * const arr = [1, 2, 3];
 * isArray(arr) // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is an Array, else false.
 */
export const isArray = Array.isArray;

/**
 * Determines if the passed value is a Function.
 *
 * @example
 *
 * const func = function() {};
 * isFunction(func) // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is a Function, else false.
 */
export function isFunction(arg: unknown) {
  return typeOf(arg) === 'Function';
}

/**
 * Determines if the passed value is null or undefined.
 *
 * @example
 *
 * const value = null;
 * isNil(value); // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is null or undefined, else false.
 */
export function isNil(arg: unknown) {
  return arg === undefined || arg === null;
}

/**
 * Determines if the passed value is a Number.
 *
 * @example
 *
 * const value = 123;
 * isNumber(value); // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is a Number, else false.
 */
export function isNumber(arg: unknown) {
  return typeOf(arg) === 'Number';
}

/**
 * Determines if the passed value is an Object.
 *
 * @example
 *
 * const value = { key: 'value' };
 * isObject(value); // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is an Object, else false.
 */
export function isObject(arg: unknown) {
  return typeOf(arg) === 'Object';
}

/**
 * Determines if the passed value is a Promise.
 *
 * @example
 *
 * const value = new Promise((resolve, reject) => {});
 * isPromise(value); // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is a Promise, else false.
 */
export function isPromise(arg: unknown) {
  return ['Async', 'Promise'].includes(typeOf(arg));
}

/**
 * Determines if the passed value is a String.
 *
 * @example
 *
 * const value = 'Hello World';
 * isString(value); // returns true
 *
 * @param {any} arg - The value to be checked.
 *
 * @returns {boolean} - Returns true if the value is a String, else false.
 */
export function isString(arg: unknown) {
  return typeOf(arg) === 'String';
}

/**
 * Checks if the given argument is empty.
 *
 * @example
 *
 * isEmpty(null); // returns true
 * isEmpty(undefined); // returns true
 * isEmpty([]); // returns true
 * isEmpty({}); // returns true
 * isEmpty(''); // returns false
 * isEmpty(123); // returns false
 * isEmpty('abc'); // returns false
 * isEmpty([1, 2, 3]); // returns false
 * isEmpty({ a: 1, b: 2 }); // returns false
 *
 * @param {any} arg - The argument to be checked.
 *
 * @returns {boolean} - Returns true if the argument is null, undefined, an empty array, or an empty object. Otherwise, it returns false.
 */
export function isEmpty(arg: unknown) {
  return isNil(arg) || ((isArray(arg) || isObject(arg)) && !Object.entries(arg || {}).length);
}

/**
 * Checks if the two given arguments are equal.
 *
 * @example
 *
 * isEquals(null, null); // returns true
 * isEquals(undefined, undefined); // returns true
 * isEquals([], []); // returns true
 * isEquals({}, {}); // returns true
 * isEquals('abc', 'abc'); // returns true
 * isEquals(123, 123); // returns true
 * isEquals([1, 2, 3], [1, 2, 3]); // returns true
 * isEquals({ a: 1, b: 2 }, { a: 1, b: 2 }); // returns true
 *
 * isEquals(null, undefined); // returns false
 * isEquals([], {}); // returns false
 * isEquals('abc', 'def'); // returns false
 * isEquals(123, 456); // returns false
 * isEquals([1, 2, 3], [4, 5, 6]); // returns false
 * isEquals({ a: 1, b: 2 }, { c: 3, d: 4 }); // returns false
 *
 * @param {any} curr - The first argument to be compared.
 * @param {any} prev - The second argument to be compared.
 *
 * @returns {boolean} - Returns true if the arguments are equal, otherwise it returns false.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isEqual(curr: any, prev: any): boolean {
  if (curr === prev) return true;

  if (typeOf(curr) !== typeOf(prev)) return false;

  if (isArray(curr)) {
    if (curr.toString() !== prev.toString()) return false;

    return !curr.some((val: unknown, idx: number) => val !== prev[idx] && !isEqual(val, prev[idx]));
  }

  if (isObject(curr)) {
    const keys = Object.keys(curr);

    if (keys.length !== Object.keys(prev).length) return false;

    return !keys.some((key) => curr[key] !== prev[key] && !isEqual(curr[key], prev[key]));
  }

  return false;
}

/**
 * Attempts to execute a function and returns its result. If an error occurs during the execution, it logs the error and returns undefined.
 *
 * @example
 *
 * const successfulFn = () => 'success';
 * const failingFn = () => { throw new Error('failure'); };
 *
 * attempt(successfulFn); // returns 'success'
 * attempt(failingFn); // logs the error and returns undefined
 *
 * @template T
 * @template R
 * @param {T} fn - The function to be executed.
 * @param {Parameters<T>} args - The arguments to be passed to the function.
 *
 * @returns {ReturnType<T>} - The result of the function execution if successful, otherwise undefined.
 */
export function attempt<T extends (...args: unknown[]) => R, R>(fn: T, ...args: Parameters<T>) {
  // biome-ignore lint/style/noArguments: <explanation>
  if (arguments.length === 1) return (..._args: Parameters<T>) => attempt(fn, ..._args) as ReturnType<T>;

  try {
    return Promise.resolve(fn(...args)) as ReturnType<T>;
  } catch (err) {
    Logger.error('attempt() -> unexpected error', err);

    return Promise.reject(err);
  }
}

/**
 * Delays the execution of a function by a specified amount of time.
 *
 * @example
 *
 * const log = () => console.log('Hello, world!');
 *
 * delay(log, 1000); // logs 'Hello, world!' after 1 second
 *
 * @template T
 * @param {() => T} fn - The function to be delayed.
 * @param {number} ms - The amount of time to delay the function execution, in milliseconds. Default is 700.
 *
 * @returns {Promise} - A Promise that resolves with the result of the function execution.
 */
export async function delay<T extends () => void>(fn: T, ms = 700) {
  await sleep(ms);

  return Promise.resolve(fn());
}

/**
 * Creates a debounced function that delays invoking the provided function until after a specified wait time has elapsed since the last time the debounced function was invoked.
 *
 * @example
 *
 * const log = () => console.log('Hello, world!');
 * const debouncedLog = debounce(log, 1000);
 *
 * debouncedLog(); // logs 'Hello, world!' after 1 second, subsequent calls within the same second will reset the delay
 *
 * @template T
 * @param {() => T} fn - The function to debounce.
 * @param {number} ms - The number of milliseconds to delay. Default is 300.
 * @param {boolean} immediate - If true, the function will be called at the start of the delay period instead of the end. Default is false.
 *
 * @returns {Function} - A new function that debounces the input function.
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 300, immediate?: boolean) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (immediate && !timeout) fn(...args);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;

      if (!immediate) fn(...args);
    }, ms);
  };
}

/**
 * Creates a function that memoizes the result of the provided function. If the memoized function is called subsequently with the same arguments, it retrieves the cached result instead of invoking the function again.
 *
 * @example
 *
 * const add = (x, y) => x + y;
 * const memoizedAdd = memoize(add);
 *
 * memoizedAdd(1, 2); // returns 3 and caches the result
 * memoizedAdd(1, 2); // retrieves the result from cache instead of invoking the function again
 *
 * @template T
 * @param {() => T} fn - The function to memoize.
 *
 * @returns {Function} - A new function that memoizes the input function.
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T) {
  const cache: Record<string, ReturnType<T>> = {};

  return (...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (!cache[key]) cache[key] = fn(...args) as ReturnType<T>;

    return cache[key];
  };
}

/**
 * Creates a new Proxy for the given object that invokes a function whenever a property of the object is set.
 *
 * @example
 *
 * const obj = { a: 1, b: 2 };
 * const log = (prop, curr, prev, target) => console.log(`Property '${prop}' changed from ${prev} to ${curr}`);
 *
 * const observedObj = observe(obj, log);
 *
 * observedObj.a = 3; // logs 'Property 'a' changed from 1 to 3'
 *
 * @template T
 * @param {Object} obj - The object to observe.
 * @param {() => T} fn - The function to be invoked when a property of the object is set. It receives the property key, the new value, the previous, and the target object value as arguments.
 *
 * @returns {Proxy} - A new Proxy for the given object.
 */
export function proxy<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  fn: (prop: K, curr: T[K], prev: T[K], target: T) => void,
) {
  return new Proxy(obj, {
    set(target, prop, val, receiver) {
      fn(prop as K, val, target[prop as K], target);

      return Reflect.set(target, prop, val, receiver);
    },
  });
}

/**
 * Parses a JSON string and returns the resulting object. If parsing fails, it logs the error and returns a default value.
 *
 * @example
 *
 * const json = '{"a":1,"b":2,"c":3}';
 * const defaultValue = { a: 0, b: 0, c: 0 };
 *
 * parseJSON(json, defaultValue); // returns { a: 1, b: 2, c: 3 }
 * parseJSON('invalid', defaultValue); // logs the error and returns { a: 0, b: 0, c: 0 }
 *
 * @template T
 * @param {string} json - The JSON string to parse. If not a string, it is returned as is.
 * @param {T} defaultValue - The value to return if parsing fails. Default is undefined.
 *
 * @returns {T | undefined} - The parsed object if successful, otherwise the default value.
 */
export function parseJSON<T>(json?: string, defaultValue?: T): T | undefined {
  try {
    const value = typeof json === 'string' ? JSON.parse(json) : json;

    return value ?? defaultValue;
  } catch (err) {
    Logger.error('parseJSON() -> failed to parse object', err);

    return defaultValue;
  }
}

/**
 * Composes multiple functions into a single function. It starts from the rightmost function and proceeds to the left.
 *
 * @example
 *
 * const add = (x) => x + 2;
 * const multiply = (x) => x * 3;
 * const subtract = (x) => x - 4;
 *
 * const composedFn = compose(subtract, multiply, add);
 *
 * composedFn(5); // returns ((5 + 2) * 3) - 4 = 15
 *
 * @param {() => T} fn - The first function to be composed.
 * @param {...Function} fns - The rest of the functions to be composed.
 *
 * @returns {Function} - A new function that is the composition of the input functions.
 */
export function compose<T>(fn: (args: T) => T, ...fns: Array<(args: T) => T>) {
  return fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn);
}

/**
 * Pipes multiple functions into a single function. It starts from the leftmost function and proceeds to the right.
 *
 * @example
 *
 * const add = (x) => x + 2;
 * const multiply = (x) => x * 3;
 * const subtract = (x) => x - 4;
 *
 * const pipedFn = pipe(add, multiply, subtract);
 *
 * pipedFn(5); // returns ((5 * 3) + 2) - 4 = 13
 *
 * @param {() => T} fn - The first function to be piped.
 * @param {...Function} fns - The rest of the functions to be piped.
 *
 * @returns {Function} - A new function that is the pipe of the input functions.
 */
export function pipe<T extends unknown[], U>(fn: (...args: T) => U, ...fns: Array<(args: U) => U>) {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: U) => nextFn(prevFn(value)),
    (value) => value,
  );

  return (...args: T) => piped(fn(...args));
}

/**
 * Creates a race between the provided function and a timeout. If the function does not complete within the specified time, the Promise is rejected.
 *
 * @example
 *
 * const slowFn = () => new Promise(resolve => setTimeout(() => resolve('slow'), 10000));
 * const fastFn = () => new Promise(resolve => setTimeout(() => resolve('fast'), 5000));
 *
 * predict(slowFn, 7000); // rejects after 7 seconds
 * predict(fastFn, 7000); // resolves with 'fast' after 5 seconds
 *
 * @template T
 * @param {() => T} fn - The function to execute.
 * @param {number} ms - The number of milliseconds to wait before rejecting the Promise. Default is 7000.
 *
 * @returns {Promise<T>} - A Promise that resolves with the result of the function execution if it completes within the specified time, otherwise it is rejected.
 */
export function predict<T extends Promise<unknown>>(fn: T, ms = 7000) {
  return Promise.race([fn, new Promise((_, reject) => setTimeout(reject, ms))]);
}

/**
 * Retries an asynchronous function a specified number of times with a delay.
 *
 * @example
 *
 * retry(fn, { times: 3, delay: 1000 })
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 *
 * @template T
 * @param {() => T} fn - The asynchronous function to retry.
 * @param {{ times: number; delay: number }} options - The options for retrying the function.
 * @param {number} options.times - The number of times to retry the function.
 * @param {number} options.delay - The delay in milliseconds between retries.
 *
 * @returns {Promise<T>} - The result of the asynchronous function.
 */
export async function retry<T>(
  fn: () => T,
  { times = 3, delay = 250 }: { times?: number; delay?: number },
): Promise<T> {
  try {
    return fn();
  } catch (err) {
    if (times === 0) {
      throw err;
    }

    Logger.warn(`retry() -> ${err}, retrying (${times}x) again in ${delay}ms`);

    if (delay > 0) await sleep(delay);

    return retry(fn, { delay, times: times - 1 });
  }
}

/**
 * Creates a Promise that resolves after a specified amount of time.
 *
 * @example
 *
 * sleep(1000).then(() => console.log('Hello, world!')); // logs 'Hello, world!' after 1 second
 *
 * @param {number} ms - The number of milliseconds to wait before resolving the Promise.
 *
 * @returns {Promise<void>} - A Promise that resolves after the specified time.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a throttled function that only invokes the provided function at most once per every specified milliseconds.
 *
 * @example
 *
 * const log = () => console.log('Hello, world!');
 * const throttledLog = throttle(log, 1000);
 *
 * throttledLog(); // logs 'Hello, world!' immediately
 * throttledLog(); // does nothing because less than 1 second has passed since the last invocation
 * setTimeout(throttledLog, 1000); // logs 'Hello, world!' after 1 second
 *
 * @template T
 * @param {() => T} fn - The function to throttle.
 * @param {number} ms - The number of milliseconds to wait before invoking the function again. Default is 700.
 *
 * @returns {void} - A new function that throttles the input function.
 */
export function throttle<T extends (...args: unknown[]) => void>(fn: T, ms = 700) {
  let elapsed = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - elapsed >= ms) {
      fn(...args);
      elapsed = now;
    }
  };
}

/**
 * Generates a unique identifier using the window.crypto API.
 *
 * @example
 *
 * uuid(); // returns a unique identifier, e.g., '3e6c4e9c'
 *
 * @returns {string} - A unique identifier.
 */
export function uuid(): string {
  return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

// OBJECTS

/**
 * Creates a deep copy of the provided data using the structuredClone algorithm.
 *
 * @example
 *
 * const obj = { a: 1, b: { c: 2 } };
 * const dup = clone(obj);
 *
 * dup.b.c = 3;
 * console.log(obj.b.c); // logs 2
 * console.log(dup.b.c); // logs 3
 *
 * @template T
 * @param {T} obj - The data to clone.
 *
 * @returns {T} - A deep copy of the provided data.
 */
export function clone<T>(obj: T) {
  return structuredClone(obj);
}

/**
 * Computes the difference between two objects.
 *
 * @example
 *
 * const obj1 = { a: 1, b: 2, c: 3 };
 * const obj2 = { b: 2, c: 3, d: 4 };
 *
 * diff(obj1, obj2); // returns { d: 4 }
 *
 * @template T
 * @param {T} prev - The previous object.
 * @param {T} curr - The current object.
 *
 * @returns {T} - An object containing new/diff properties from a previous object.
 */
export const diff = <T extends Record<string, unknown>>(prev: T, curr: T) => {
  const data = {} as T;

  Object.keys(curr).forEach((key: keyof T) => {
    if (isObject(curr[key]) && !isEqual(prev[key], curr[key])) {
      data[key] = diff(prev[key] as T, curr[key] as T) as T[keyof T];
    } else if (!isObject(curr[key]) && !isEqual(prev[key], curr[key])) {
      data[key] = curr[key];
    }
  });

  return data;
};

/**
 * Returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 * entries(obj); // logs [['a', 1], ['b', 2], ['c', 3]]
 *
 * @template T
 * @param {T} obj - The object whose properties are to be returned.
 *
 * @returns {Entries<T>} - An array of the object's own enumerable string-keyed property [key, value] pairs.
 */
export function entries<T extends Record<string, unknown>>(obj: T): Entries<T> {
  return isObject(obj) ? (Object.entries(obj) as Entries<T>) : [];
}

/**
 * Retrieves the value at a given path of the object. If the value is undefined, the default value is returned.
 *
 * @example
 *
 * const obj = { a: { b: { c: 3 } } };
 *
 * get(obj, 'a.b.c'); // returns 3
 * get(obj, 'a.b.d', 'default'); // returns 'default'
 *
 * @template T
 * @template K
 * @param {T} obj - The object to query.
 * @param {K | string} path - The path of the property to get.
 * @param {any} defaultValue - The value returned for undefined resolved values. Default is undefined.
 *
 * @returns {any} - The resolved value.
 */
export function get<T extends Record<string, unknown>, K extends string>(
  obj: T,
  path: K | string,
  defaultValue?: unknown,
) {
  const fragments = path.split(/[,[\].]+?/);
  let value: unknown;

  for (let i = 0; i < fragments.length; i++) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (!obj.hasOwnProperty(fragments[i])) {
      return defaultValue;
    }

    value = obj[fragments[i]];
  }

  return value;
}

/**
 * Checks if the object has the specified property as its own property.
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * has(obj, 'a'); // returns true
 * has(obj, 'd'); // returns false
 *
 * @template T
 * @template K
 * @param {T} obj - The object to query.
 * @param {K} prop - The property to check.
 *
 * @returns {boolean} - True if the object has the property, false otherwise.
 */
export function has<T extends Record<string, unknown>, K extends keyof T>(obj: T, prop: K) {
  // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
  return obj?.hasOwnProperty(prop);
}

/**
 * Returns an array of the keys for an object's properties.
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * keys(obj); // returns ['a', 'b', 'c']
 *
 * @template T
 * @template K
 * @param {T} obj - The object to query.
 *
 * @returns {boolean} - True if the object has the property, false otherwise.
 */
export function keys<T extends Record<string, unknown>, K extends keyof T>(obj: T) {
  return isObject(obj) ? (Object.keys(obj) as K[]) : [];
}

/**
 * Merges two or more objects to create a new object. If the input objects have a property with the same key, the property from the last object with that key is used.
 *
 * @example
 *
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { b: 3, c: 4 };
 * const obj3 = { c: 5, d: 6 };
 *
 * merge(obj1, obj2, obj3); // returns { a: 1, b: 3, c: 5, d: 6 }
 *
 * @template T
 * @param {...T} args - The objects to merge.
 *
 * @returns {Merge<T>} - A new object with properties from the input objects.
 */
export function merge<T extends Record<string, unknown>[]>(...args: [...T]): Merge<T> {
  const target = args.shift();

  if (!target) return {} as Merge<T>;

  const source = args.shift();

  if (!source) return target as Merge<T>;

  entries(source).forEach(([key, value]) => {
    if (isObject(value)) {
      if (!target[key]) Object.assign(target, { [key]: {} });

      merge(target[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else if (isArray(value)) {
      if (!target[key]) Object.assign(target, { [key]: [] });

      (value as unknown[]).forEach((curr) => {
        if (!(target[key] as unknown[]).some((prev: unknown) => isEqual(curr, prev))) {
          (target[key] as unknown[]).push(curr);
        }
      });
    } else {
      Object.assign(target, { [key]: value });
    }
  });

  return merge(target, ...args) as unknown as Merge<T>;
}

/**
 * Returns an array of values for an object's properties
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 * values(obj); // returns [1, 2, 3]
 *
 * @template T
 * @template K
 * @param {T} obj - The object whose property values are to be returned.
 *
 * @returns {T[K][]} - An array of the object's own enumerable string-keyed property values.
 */
export function values<T extends Record<string, unknown>, K extends keyof T>(obj: T) {
  return isObject(obj) ? (Object.values(obj) as T[K][]) : [];
}

// ARRAYS

/**
 * Flattens a nested array into a single-level array.
 *
 * @example
 *
 * const arr = [1, [2, [3, [4, [5]]]]];
 * flatten(arr) // returns [1, 2, 3, 4, 5];
 *
 * @template T
 * @param {T | T[]} arr - The array to flatten.
 *
 * @returns {T | T[]} - A single-level array.
 */
export function flatten<T>(arr: T | T[]) {
  return isArray(arr) ? arr.flat(Number.POSITIVE_INFINITY) : arr;
}

/**
 * Checks if a value is present in an array.
 *
 * @example
 *
 * const arr = [1, 2, 3, { a: 1 }, 'hello'];
 * const value = { a: 1 };
 *
 * contains(arr, value) // returns true;
 *
 * @param {unknown[]} arr - The array to check.
 * @param {unknown} value - The value to search for.
 *
 * @returns {boolean} - Returns true if the value is present in the array, else false.
 */
export function contains(arr: unknown[], value: unknown) {
  return arr.some((item) => isEqual(item, value));
}

/**
 * Groups the elements of an array based on the given key.
 *
 * @example
 *
 * const data = [{ a: 2 }, { a: 1 }];
 * groupBy(data, 'a') // returns { '1': [{ a: 2 }], '2': [{ a: 1 }] };
 *
 * @template T
 * @template K
 * @param {T[]} arr - The array to group.
 * @param {K} key - The key to group the elements by.
 *
 * @returns {GroupBy<T, K>} - An object with keys as the grouped values and values as arrays of elements.
 */
export function groupBy<T extends Record<string, unknown>, K extends keyof T>(arr: T[], key: K): GroupBy<T, K> {
  return arr.reduce(
    (acc, val: T) => {
      acc[val[key]] ||= [];
      acc[val[key]].push(val);
      return acc;
    },
    {} as GroupBy<T, K>,
  );
}

/**
 * Creates an object composed of keys generated from the results of running each element of the array through the key. The corresponding value of each key is the last element responsible for generating the key.
 *
 * @example
 *
 * const data = [{ a: 1 }, { a: 2 }, { a: 1 }];
 * keyBy(data, 'a') // returns { '1': { a: 1 }, '2': { a: 2 } };
 *
 * @template T
 * @template K
 * @param {T[]} arr - The array to key.
 * @param {K} key - The key to generate the object.
 *
 * @returns {KeyBy<T, K>} - An object with keys as the generated values and values as the last element responsible for generating the key.
 */
export function keyBy<T extends Record<string, unknown>, K extends keyof T>(arr: T[], key: K): KeyBy<T, K> {
  return arr.reduce(
    (acc, val: T) => {
      acc[val[key]] = val;
      return acc;
    },
    {} as KeyBy<T, K>,
  );
}

/**
 * Creates an array of numbers progressing from start up to, but not including, end. A step is used to specify the difference between each number in the array.
 *
 * @example
 *
 * const start = 0;
 * const stop = 10;
 * const step = 2;
 *
 * range(start, stop, step) // returns [0, 2, 4, 6, 8];
 *
 * @param {number} start - The start of the range.
 * @param {number} stop - The end of the range.
 * @param {number} step - The value to increment or decrement by.
 *
 * @returns {number[]} - Returns the range of numbers.
 */
export function range(start: number, stop: number, step: number) {
  return Array.from({ length: Math.floor((stop - start) / step) + 1 }, (_, i) => start + i * step);
}

/**
 * Creates an array of numbers progressing from min to max with a specified number of steps.
 *
 * @example
 *
 * const min = 0;
 * const max = 10;
 * const steps = 5;
 *
 * rate(min, max, steps) // returns [0, 2.5, 5, 7.5, 10];
 *
 * @param {number} min - The start of the range.
 * @param {number} max - The end of the range.
 * @param {number} steps - The number of steps between min and max.
 *
 * @returns {number[]} - Returns the range of numbers.
 */
export function rate(min: number, max: number, steps = 5) {
  const difference = max - min;

  return Array.from({ length: steps }, (_, i) => min + (i * difference) / (steps - 1));
}

/**
 * Generates an array of dates between a start and end date, with a specified interval and step size.
 *
 * @example
 *
 * const start = '2022-01-01';
 * const end = '2022-01-31';
 * const options = { interval: 'D', steps: 1, latest: false };
 *
 * dateRange(start, end, options); // returns an array of dates for every day in January 2022
 *
 * @param {Date | string} start - The start date of the range. Can be a Date object or a string in a format recognized by the Date.parse() method.
 * @param {Date | string} end - The end date of the range. Can be a Date object or a string in a format recognized by the Date.parse() method.
 * @param {{ interval: 'D' | 'W' | 'M' | 'MS' | 'ME' | 'Y' | 'YS' | 'YE'; steps: number; latest: boolean }} options - The options for generating the date range.
 * @param {string} options.interval - The interval for generating the dates. Can be 'D' for days, 'W' for weeks, 'M' for months, 'MS' for start of the month, 'ME' for end of the month, 'Y' for years, 'YS' for start of the year, 'YE' for end of the year.
 * @param {number} options.steps - The step size for generating the dates. For example, if interval is 'D' and steps is 2, dates will be generated every 2 days.
 * @param {boolean} options.latest - If true, the function will include the latest date even if it falls outside the specified interval.
 *
 * @returns {Date[]} - An array of dates between the start and end date, with the specified interval and step size.
 */
export function dateRange(
  start: Date | string,
  end: Date | string,
  {
    interval = 'D',
    steps = 1,
    latest = false,
  }: { interval: 'D' | 'W' | 'M' | 'MS' | 'ME' | 'Y' | 'YS' | 'YE'; steps: number; latest: boolean },
) {
  try {
    const dateArray = [];
    let currentDate = typeof start === 'string' ? new Date(start) : start;
    let endDate = typeof end === 'string' ? new Date(end) : end;

    switch (interval) {
      case 'MS':
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        break;
      case 'ME':
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
        break;
      case 'YS':
        currentDate = new Date(currentDate.getFullYear(), 0, 1);
        break;
      case 'YE':
        currentDate = new Date(currentDate.getFullYear(), 11, 31);
        endDate = new Date(endDate.getFullYear(), 11, 31);
        break;
    }

    const calculateInterval = {
      D: () => currentDate.setUTCDate(currentDate.getUTCDate() + steps),
      W: () => currentDate.setUTCDate(currentDate.getUTCDate() + 7 * steps),
      M: () => currentDate.setUTCMonth(currentDate.getUTCMonth() + steps),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      MS: () => (currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + steps, 1)),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      ME: () => (currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + steps + 1, 0)),
      Y: () => currentDate.setUTCFullYear(currentDate.getUTCFullYear() + steps),
      YS: () => currentDate.setUTCFullYear(currentDate.getUTCFullYear() + steps),
      YE: () => currentDate.setUTCFullYear(currentDate.getUTCFullYear() + steps),
    };

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      calculateInterval[interval]();

      if (currentDate >= endDate && latest) dateArray.push(new Date(currentDate));
    }

    return dateArray;
  } catch (err) {
    Logger.error('dateRange() -> unexpected error', err);

    return [];
  }
}

/**
 * Sorts an array of objects by a specific key in ascending order.
 *
 * @example
 *
 * const data = [{ a: 2 }, { a: 3 }, { a: 1 }];
 * sortBy(data, 'a'); // returns [{ a: 1 }, { a: 2 }, { a: 3 }]
 *
 * @template T
 * @template K
 * @param {T[]} arr - The array of objects to sort.
 * @param {K} key - The key to sort by.
 *
 * @returns {T[]} - A new array sorted by the specified key.
 */
export function sortBy<T, K extends keyof T>(arr: T[], key: K) {
  return [...arr].sort((a: T, b: T) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
}

/**
 * Creates a duplicate-free version of an array, using SameValueZero for equality comparisons, in which only the first occurrence of each element is kept. The order of result values is determined by the order they occur in the array.
 *
 * @example
 *
 * const arr = [1, 2, 2, 3, 3, 3];
 * uniq(arr); // returns [1, 2, 3]
 *
 * @template T
 * @param {T[]} arr - The array to inspect.
 *
 * @returns {T[]} - Returns the new duplicate free array.
 */
export function uniq<T>(arr: T[]) {
  return [...new Set(arr)];
}

// STRINGS

/**
 * Converts a string to kebab case.
 *
 * @example
 *
 * const text = 'Hello World';
 * toKebabCase(text); // returns 'hello-world'
 *
 * @param {string} str - The string to convert.
 *
 * @returns {string} - The converted string.
 */
export function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to snake case.
 *
 * @example
 *
 * const text = 'Hello World';
 * toSnakeCase(text) // returns 'hello_world;
 *
 * @param {string} str - The string to convert.
 *
 * @returns {string} - The converted string.
 */
export function toSnakeCase(str: string) {
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((s) => s.toLowerCase())
    .join('_');
}

/**
 * Truncates a string if it is longer than the given maximum string length. The last characters of the truncated string are replaced with the ellipsis sign "…".
 *
 * @example
 *
 * const text = 'Hello World';
 * truncate(text, 5); // returns 'Hello…
 *
 * @param {string} str - The string to truncate.
 * @param {number} limit - The maximum string length.
 * @param {boolean} completeWords - If true, the string is truncated to the nearest word, instead of character.
 * @param {string} ellipsis - The characters to end the truncated string with.
 *
 * @returns {string} - The truncated string.
 */
export function truncate(str: string, limit = 25, completeWords = false, ellipsis = '…'): string {
  let _limit = limit;
  if (completeWords) {
    _limit = str.substring(0, _limit).lastIndexOf(' ');
  }

  return str.length > _limit ? `${str.substring(0, _limit)}${ellipsis}` : str;
}
