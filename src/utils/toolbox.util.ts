// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
import { Logger } from './logger.util';

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
 * @param {any} arg the argument whose type is to be determined.
 *
 * @returns {string} the type of the argument. If the argument is a null, it returns 'Null'.
 * If the argument is undefined, it returns 'Undefined'. If the argument is NaN, it returns 'NaN'.
 * If the argument is an async function, it returns 'Promise'. Otherwise, it returns the actual type of the argument.
 */
export function typeOf(arg: unknown): ArgType {
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

  return type === 'AsyncFunction' ? 'Promise' : (type as ArgType);
}

type ArgType = 'Null' | 'Undefined' | 'NaN' | 'Promise' | 'Number' | 'String' | 'Object' | 'Array' | 'Function';

/**
 * Determines if the passed value is an Array.
 *
 * @example
 *
 * const arr = [1, 2, 3];
 * isArray(arr) // returns true
 *
 * @param {any} arg the value to be checked.
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
 * @param {any} arg the value to be checked.
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
 * @param {any} arg the value to be checked.
 *
 * @returns {boolean} - Returns true if the value is null or undefined, else false.
 */
export function isNil(arg: unknown): arg is null | undefined {
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
 * @param {any} arg the value to be checked.
 *
 * @returns {boolean} - Returns true if the value is a Number, else false.
 */
export function isNumber(arg: unknown): arg is number {
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
 * @param {any} arg the value to be checked.
 *
 * @returns {boolean} - Returns true if the value is an Object, else false.
 */
export function isObject(arg: unknown): arg is Record<string, unknown> {
  return typeOf(arg) === 'Object';
}

/**
 * Determines if a value is a plain object (not an array, function, or null).
 *
 * @param arg - The value to check.
 * @returns True if the value is a plain object.
 */
export function isPlainObject(arg: unknown): arg is Record<string, unknown> {
  return typeof arg === 'object' && arg !== null && !Array.isArray(arg);
}

/**
 * Determines if the passed value is a Promise.
 *
 * @example
 *
 * const value = new Promise((resolve, reject) => {});
 * isPromise(value); // returns true
 *
 * @param {any} arg the value to be checked.
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
 * @param {any} arg the value to be checked.
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
 * @param {any} arg the argument to be checked.
 *
 * @returns {boolean} - Returns true if the argument is null, undefined, an empty array, or an empty object. Otherwise, it returns false.
 */
export function isEmpty(arg: unknown) {
  return isNil(arg) || ((isArray(arg) || isObject(arg)) && !Object.entries(arg || {}).length);
}

/**
 * Deeply compares two values for equality, including objects, arrays, and primitives.
 * Detects circular references and optimizes performance.
 *
 * @example
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * isEqual({ a: { b: 2 } }, { a: { b: 2 } }); // true
 * isEqual({ a: 1 }, { a: 2 }); // false
 * isEqual({ a: 1 }, { b: 1 }); // false
 *
 * @param a - First value to compare.
 * @param b - Second value to compare.
 * @param seen - Internal Set to track circular references.
 * @returns Whether the values are deeply equal.
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: -
export function isEqual(a: unknown, b: unknown, seen = new WeakSet()): boolean {
  if (a === b) return true; // Strict equality check

  if (typeof a !== typeof b) return false; // Different types cannot be equal

  if (a === null || b === null) return false; // One is null, but not both

  if (typeof a !== 'object' || typeof b !== 'object') return false; // Primitives mismatch

  if (seen.has(a) || seen.has(b)) return true; // Handle circular references
  seen.add(a);
  seen.add(b);

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false; // Length mismatch
    return a.every((item, index) => isEqual(item, b[index], seen)); // Element-wise comparison
  }

  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime(); // Compare Dates

  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString(); // Compare RegExp

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    return [...a.keys()].every((key) => b.has(key) && isEqual(a.get(key), b.get(key), seen));
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    return [...a].every((val) => b.has(val));
  }

  // biome-ignore lint/suspicious/noExplicitAny: -
  const keysA = Object.keys(a).concat(Object.getOwnPropertySymbols(a) as any);
  // biome-ignore lint/suspicious/noExplicitAny: -
  const keysB = Object.keys(b).concat(Object.getOwnPropertySymbols(b) as any);

  if (keysA.length !== keysB.length) return false; // Property count mismatch

  // biome-ignore lint/suspicious/noExplicitAny: -
  return keysA.every((key) => isEqual((a as any)[key], (b as any)[key], seen)); // Deep property comparison
}

/**
 * Asserts that the condition is true. If the condition is false, it throws an error
 * with the provided message or logs a warning in soft mode.
 *
 * @example
 *
 * assert(Array.isArray([])); // Does nothing
 * assert(typeof foo === 'string', 'This is an error message'); // Throws an error
 * assert(x > 0, 'x must be positive', { value: x }); // Throws with context
 *
 * @param condition - The condition to assert, or an array of conditions.
 * @param message - (Optional) The error message to throw. Default is 'Assertion failed'.
 * @param context - (Optional) Additional debugging information (e.g., variable values).
 * @param options - (Optional) Assertion options.
 * @param options.errorType - The error class to throw (default: `Error`).
 * @param options.soft - If true, logs a warning instead of throwing an error.
 */
export function assert(
  condition: boolean | boolean[],
  message?: string,
  // biome-ignore lint/suspicious/noExplicitAny: -
  context?: Record<string, any>,
  // biome-ignore lint/suspicious/noExplicitAny: -
  options: { errorType?: new (...args: any[]) => Error; soft?: boolean } = {},
): void {
  const { errorType = Error, soft = false } = options;

  // Handle multiple conditions
  const failed = Array.isArray(condition) ? condition.some((c) => !c) : !condition;

  if (!failed) return;

  // Construct error message
  const errorMessage = message ?? 'Assertion failed';
  const errorDetails = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';

  if (soft) {
    Logger.warn(`Warning: ${errorMessage}${errorDetails}`);
    return;
  }

  throw new errorType(`${errorMessage}${errorDetails}`);
}

/**
 * Attempts to execute a function and returns its result.
 * - If `fn` succeeds, it returns the result.
 * - If `fn` throws an error, it logs the error (unless `silent` is true) and returns `undefined` for sync functions or rejects for async functions.
 *
 * @example
 * const successfulFn = () => 'success';
 * const failingFn = () => { throw new Error('failure'); };
 *
 * attempt(successfulFn); // returns 'success'
 * attempt(failingFn); // logs the error and returns undefined
 *
 * @template R
 * @param fn - The function to be executed.
 * @param args - The arguments to be passed to the function.
 * @param silent - (Optional) If `true`, suppresses error logging.
 *
 * @returns The result of the function execution if successful, otherwise `undefined` (for sync) or rejected promise (for async).
 */
export function attempt<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ...args: [...Parameters<T>, boolean?] // Last argument can be `silent` flag
): ReturnType<T> | undefined {
  const silent = typeof args[args.length - 1] === 'boolean' ? (args.pop() as boolean) : false;

  try {
    const result = fn(...(args as unknown as Parameters<T>));

    // Handle both sync and async functions correctly
    if (result instanceof Promise) {
      return result.catch((err) => {
        if (!silent) Logger.error('attempt() -> unexpected async error', { cause: err });
        return Promise.reject(err);
      }) as ReturnType<T>;
    }

    return result as ReturnType<T>;
  } catch (err) {
    if (!silent) Logger.error('attempt() -> unexpected error', { cause: err });

    return undefined as ReturnType<T>;
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
 * @param fn the function to be delayed.
 * @param ms the amount of time to delay the function execution, in milliseconds. Default is 700.
 *
 * @returns {Promise} - A Promise that resolves with the result of the function execution.
 */
export async function delay<T extends () => void>(fn: T, ms = 700) {
  await sleep(ms);

  return fn();
}

/**
 * Creates a debounced function that delays invoking the provided function until after
 * a specified wait time has elapsed since the last invocation.
 *
 * Supports `immediate` execution, `cancel()`, and `flush()`.
 *
 * @example
 * const log = () => console.log('Hello, world!');
 * const debouncedLog = debounce(log, 1000);
 *
 * debouncedLog(); // Logs 'Hello, world!' after 1 second.
 * debouncedLog.cancel(); // Cancels the pending execution.
 *
 * @param fn - The function to debounce.
 * @param ms - The delay in milliseconds. Default is 300ms.
 * @param immediate - If `true`, execute immediately on the first call.
 *
 * @returns A debounced function with `.cancel()` and `.flush()` methods.
 */

// biome-ignore lint/suspicious/noExplicitAny: -
export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300, immediate = false) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let result: ReturnType<T> | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: -
  function debounced(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    const callNow = immediate && !timeout;

    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) result = fn.apply(this, args)!;
    }, ms);

    if (callNow) {
      result = fn.apply(this, args)!;
    }

    return result;
  }

  // Cancels the debounced function execution
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
  };

  // Executes the function immediately if there’s a pending call
  // biome-ignore lint/suspicious/noExplicitAny: -
  debounced.flush = function (this: any) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
      // biome-ignore lint/style/noArguments: -
      // biome-ignore lint/suspicious/noExplicitAny: -
      result = fn.apply(this, arguments as any)!;
    }
    return result;
  };

  return debounced;
}

/**
 * Creates a function that memoizes the result of the provided function.
 * Supports expiration (TTL), limited cache size (LRU), and better argument handling.
 *
 * @example
 * const add = (x, y) => x + y;
 * const memoizedAdd = memoize(add, { ttl: 5000, maxSize: 10 });
 *
 * memoizedAdd(1, 2); // returns 3 and caches the result
 * memoizedAdd(1, 2); // retrieves the result from cache
 *
 * @param fn - The function to memoize.
 * @param options - Memoization options.
 * @param options.ttl - Optional time-to-live (TTL) for cache expiration (in milliseconds).
 * @param options.maxSize - Optional maximum cache size (LRU eviction).
 *
 * @returns A new function that memoizes the input function.
 */

// biome-ignore lint/suspicious/noExplicitAny: -
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  { ttl, maxSize }: { ttl?: number; maxSize?: number } = {},
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, { value: ReturnType<T>; expiresAt?: number }>();
  const keyGenerator = (args: Parameters<T>) => JSON.stringify(args); // Custom hash function

  return (...args: Parameters<T>) => {
    const key = keyGenerator(args);
    const cached = cache.get(key);

    // Check if the value exists and has not expired
    if (cached && (!cached.expiresAt || cached.expiresAt > Date.now())) {
      return cached.value;
    }

    // Compute and store the new result
    const result = fn(...args);
    cache.set(key, { value: result, expiresAt: ttl ? Date.now() + ttl : undefined });

    // Enforce max size (LRU eviction)
    if (maxSize && cache.size > maxSize) {
      const firstKey = cache.keys().next().value; // Oldest entry
      cache.delete(firstKey!);
    }

    return result;
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
 * const proxyObj = proxy(obj, log);
 *
 * proxyObj.a = 3; // logs 'Property 'a' changed from 1 to 3'
 *
 * @param obj the object to observe.
 * @param fn the function to be invoked when a property of the object is set. It receives the property key, the new value, the previous, and the target object value as arguments.
 *
 * @returns a new Proxy for the given object.
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
 * @param json the JSON string to parse. If not a string, it is returned as is.
 * @param defaultValue the value to return if parsing fails. Default is undefined.
 *
 * @returns the parsed object if successful, otherwise the default value.
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
 * @param fn the first function to be composed.
 * @param fns the rest of the functions to be composed.
 *
 * @returns a new function that is the composition of the input functions.
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
 * @param fn the first function to be piped.
 * @param fns the rest of the functions to be piped.
 *
 * @returns a new function that is the pipe of the input functions.
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
 * @param fn the function to execute.
 * @param ms the number of milliseconds to wait before rejecting the Promise. Default is 7000.
 *
 * @returns a Promise that resolves with the result of the function execution if it completes within the specified time, otherwise it is rejected.
 */
export function predict<T extends Promise<unknown>>(fn: T, ms = 7000) {
  return Promise.race([fn, new Promise((_, reject) => setTimeout(reject, ms))]);
}

/**
 * Retries an asynchronous function a specified number of times with delay and optional exponential backoff.
 *
 * @example
 *
 * retry(() => fetchData(), { times: 3, delay: 1000, backoff: 2, signal: abortSignal })
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 *
 * @param fn - The asynchronous function to retry.
 * @param options - Options for retrying the function.
 * @param options.times - The number of retry attempts (default: 3).
 * @param options.delay - The delay in milliseconds between retries (default: 250ms).
 * @param options.backoff - Exponential backoff factor (default: 1 → no backoff).
 * @param options.signal - An optional `AbortSignal` to allow canceling retries.
 *
 * @returns The result of the asynchronous function.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  {
    times = 3,
    delay = 250,
    backoff = 1,
    signal,
  }: {
    times?: number;
    delay?: number;
    backoff?: number;
    signal?: AbortSignal;
  },
): Promise<T> {
  let attempt = 0;
  let currentDelay = delay;

  while (attempt <= times) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > times) throw err;

      Logger.warn(`retry() -> ${err}, attempt ${attempt}/${times}, retrying in ${currentDelay}ms`);

      if (signal?.aborted) {
        Logger.warn(`retry() -> Aborted after ${attempt - 1} attempts`);
        throw new Error('Retry aborted');
      }

      if (currentDelay > 0) await sleep(currentDelay);

      currentDelay *= backoff; // Apply exponential backoff
    }
  }

  throw new Error('Retry failed unexpectedly');
}

/**
 * Creates a Promise that resolves after a specified amount of time.
 *
 * @example
 *
 * sleep(1000).then(() => console.log('Hello, world!')); // logs 'Hello, world!' after 1 second
 *
 * @param ms the number of milliseconds to wait before resolving the Promise.
 *
 * @returns a Promise that resolves after the specified time.
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
 * @param fn the function to throttle.
 * @param ms the number of milliseconds to wait before invoking the function again. Default is 700.
 *
 * @returns a new function that throttles the input function.
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
 * Generates a unique identifier.
 *
 * @example
 *
 * uuid(); // returns a unique identifier, e.g., 'm5wo3adksbfzngro3v'
 *
 * @returns a unique identifier.
 */
export function uuid(): string {
  return [Math.random() * 10 ** 17, Date.now()].map((val) => val.toString(36)).join('');
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
 * @param obj the data to clone.
 *
 * @returns a deep copy of the provided data.
 */
export function clone<T>(obj: T) {
  return obj && structuredClone(obj);
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
 * @param curr - The current object.
 * @param prev - The previous object.
 * @param comparator - (Optional) A custom function to compare values.
 * @returns An object containing new/modified properties.
 */
export function diff<T extends Record<string, unknown>>(
  curr?: T,
  prev?: T,
  comparator: (a: unknown, b: unknown) => boolean = isEqual,
): Partial<T> {
  if (!curr && !prev) return {} as Partial<T>;

  const result: Partial<T> = {};
  const keys = new Set([...Object.keys(curr ?? {}), ...Object.keys(prev ?? {})]);

  for (const key of keys) {
    const _curr = curr?.[key];
    const _prev = prev?.[key];

    // Avoid redundant isEqual calls
    const hasChanged = !comparator(_curr, _prev);

    if (isPlainObject(_curr) && isPlainObject(_prev)) {
      const nestedDiff = diff(_curr, _prev, comparator);
      if (Object.keys(nestedDiff).length) (result as Record<string, unknown>)[key] = nestedDiff;
    } else if (hasChanged) {
      (result as Record<string, unknown>)[key] = _curr;
    }
  }

  return result;
}

/**
 * Returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 * entries(obj); // logs [['a', 1], ['b', 2], ['c', 3]]
 *
 * @param obj the object whose properties are to be returned.
 *
 * @returns an array of the object's own enumerable string-keyed property [key, value] pairs.
 */
export function entries<T extends Record<string, unknown>>(obj: T): Entries<T> {
  return isObject(obj) ? (Object.entries(obj) as Entries<T>) : [];
}

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];

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
 * @param obj the object to query.
 * @param path the path of the property to get.
 * @param defaultValue the value returned for undefined resolved values. Default is undefined.
 *
 * @returns the resolved value.
 */
export function get<T extends Record<string, unknown>, K extends string>(
  obj: T,
  path: K | string,
  defaultValue?: unknown,
) {
  const fragments = path.split(/[,[\].]+?/);
  let value: unknown;

  for (let i = 0; i < fragments.length; i++) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: -
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
 * @param obj the object to query.
 * @param prop the property to check.
 *
 * @returns true if the object has the property, false otherwise.
 */
export function has<T extends Record<string, unknown>, K extends keyof T>(obj: T, prop: K) {
  // biome-ignore lint/suspicious/noPrototypeBuiltins: -
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
 * @param obj the object to query.
 *
 * @returns true if the object has the property, false otherwise.
 */
export function keys<T extends Record<string, unknown>, K extends keyof T>(obj: T) {
  return isObject(obj) ? (Object.keys(obj) as K[]) : [];
}

/**
 * Merges multiple objects based on a specified merge strategy.
 *
 * @example
 * const obj1 = { a: 1, b: { x: 10, y: "hello" }, c: [1] };
 * const obj2 = { b: { y: 20, z: true }, c: [2] };
 * const obj3 = { d: false, c: [3] };
 *
 * merge("deep", obj1, obj2, obj3);
 * // Returns: { a: 1, b: { x: 10, y: 20, z: true }, c: [1, 2, 3], d: false }
 *
 * merge("shallow", obj1, obj2, obj3);
 * // Returns: { a: 1, b: { y: 20, z: true }, c: [3], d: false }
 *
 * @param strategy - The merging strategy to use (default: "deep").
 * @param objects - The objects to merge.
 * @returns A new merged object.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function merge<T extends Record<string, any>[]>(strategy: MergeStrategy = 'deep', ...objects: [...T]): Merge<T> {
  if (!objects.length) return {} as Merge<T>;

  // @ts-ignore
  return objects.reduce((acc, obj) => deepMerge(acc, obj, strategy), {} as Merge<T>);
}

/**
 * Deeply merges two objects based on the provided strategy.
 *
 * - Uses **direct property access** for performance.
 * - **Avoids redundant deep merging** where unnecessary.
 * - Optimized **array merging strategies**.
 *
 * @param target - The target object.
 * @param source - The source object.
 * @param strategy - The merge strategy.
 * @returns A new merged object.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U,
  strategy: MergeStrategy,
): DeepMerge<T, U> {
  if (!isObject(source)) return source as DeepMerge<T, U>;

  const _target = clone(target) as DeepMerge<T, U>;

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue; // Avoid prototype pollution

    const sourceValue = source[key];
    const targetValue = target[key];

    if (Array.isArray(sourceValue)) {
      // biome-ignore lint/suspicious/noExplicitAny: -
      _target[key] = handleArrayMerge(targetValue, sourceValue, strategy) as any;
    } else if (isObject(sourceValue) && isObject(targetValue)) {
      // biome-ignore lint/suspicious/noExplicitAny: -
      _target[key] = deepMerge(targetValue, sourceValue, strategy) as any;
    } else {
      _target[key] = applyMergeStrategy(targetValue, sourceValue, strategy);
    }
  }

  return _target;
}

/**
 * Array merge based on strategy.
 *
 * - `"arrayConcat"` → Concatenates arrays.
 * - `"arrayReplace"` → Replaces the existing array.
 * - Default: **Unique merge** (Set-based optimization).
 */
function handleArrayMerge<T, U>(targetArray: T[], sourceArray: U[], strategy: MergeStrategy): (T | U)[] {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  if (strategy === 'arrayConcat') return targetArray.concat(sourceArray as any);
  if (strategy === 'arrayReplace') return sourceArray;
  return targetArray ? Array.from(new Set([...targetArray, ...sourceArray])) : sourceArray; // Unique merge
}

/**
 * Determines the appropriate value to assign based on the merge strategy.
 *
 * - `"lastWins"` → Overwrites with the latest value.
 * - Custom functions → Allows user-defined behavior.
 */
function applyMergeStrategy<T, U>(target: T, source: U, strategy: MergeStrategy): T | U {
  if (typeof strategy === 'function') return strategy(target, source);
  return strategy === 'lastWins' ? source : (source ?? target); // Default: Preserve if source is undefined
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type MergeStrategy = 'deep' | 'shallow' | 'lastWins' | 'arrayConcat' | 'arrayReplace' | ((a: any, b: any) => any);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Merge<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Rest extends []
    ? First
    : First extends Record<string, unknown>
      ? Rest extends Record<string, unknown>[]
        ? DeepMerge<First, Merge<Rest>>
        : First
      : First
  : unknown;

type DeepMerge<T, U> = {
  [K in keyof (T & U)]: K extends keyof T
    ? K extends keyof U
      ? U[K] extends Record<string, unknown>
        ? T[K] extends Record<string, unknown>
          ? DeepMerge<T[K], U[K]> // Recursively merge nested objects
          : U[K]
        : U[K]
      : T[K]
    : K extends keyof U
      ? U[K]
      : never;
};

/**
 * Returns an array of values for an object's properties
 *
 * @example
 *
 * const obj = { a: 1, b: 2, c: 3 };
 * values(obj); // returns [1, 2, 3]
 *
 * @param obj the object whose property values are to be returned.
 *
 * @returns an array of the object's own enumerable string-keyed property values.
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
 * @param arr the array to flatten.
 *
 * @returns a single-level array.
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
 * @param arr the array to check.
 * @param value the value to search for.
 *
 * @returns returns true if the value is present in the array, else false.
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
 * @param arr the array to group.
 * @param key the key to group the elements by.
 *
 * @returns an object with keys as the grouped values and values as arrays of elements.
 */
export function groupBy<T extends Record<string, unknown>, K extends keyof T>(arr: T[], key: K) {
  // return Object.groupBy(arr, (val) => val[key] as PropertyKey);
  return arr.reduce(
    (acc, val: T) => {
      const valueKey = String(val[key]);
      (acc as Record<string, T[]>)[valueKey] ||= [];
      acc[valueKey].push(val);
      return acc;
    },
    {} as { [Key in T[K] as string]: T[] },
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
 * @param arr the array to key.
 * @param key the key to generate the object.
 *
 * @returns an object with keys as the generated values and values as the last element responsible for generating the key.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function keyBy<T extends Record<string, any>, K extends keyof T>(arr: T[], key: K): Record<T[K], T> {
  return arr.reduce(
    (acc, val: T) => {
      acc[val[key]] = val;
      return acc;
    },
    {} as Record<T[K], T>,
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
 * @param start the start of the range.
 * @param stop the end of the range.
 * @param step the value to increment or decrement by.
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
 * @param min the start of the range.
 * @param max the end of the range.
 * @param steps the number of steps between min and max.
 *
 * @returns returns the range of numbers.
 */
export function rate(min: number, max: number, steps = 5) {
  const difference = max - min;

  return Array.from({ length: steps }, (_, i) => min + (i * difference) / (steps - 1));
}

/**
 * Generates an array of dates between a start and end date, with a specified interval and step size.
 *
 * @example
 * const options = { interval: 'D', steps: 1, latest: false };
 * dateRange('2022-01-01', '2022-01-31', options);
 * // Returns an array of dates for every day in January 2022
 *
 * @param start - The start date (Date object or ISO string).
 * @param end - The end date (Date object or ISO string).
 * @param options - Options for interval and steps.
 * @returns An array of generated dates.
 */
export function dateRange(
  start: Date | string,
  end: Date | string,
  { interval = 'D', steps = 1, latest = false }: DateRangeOptions,
): Date[] {
  try {
    if (!start || !end) throw new Error("Invalid input: 'start' and 'end' must be provided.");

    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new Error('Invalid date format. Use a valid Date object or ISO string.');
    }

    const dateArray: Date[] = [];
    let currentDate = new Date(startDate);

    // Adjust to the beginning/end of the month/year if needed
    const adjustDate = (date: Date, type: IntervalType) => {
      switch (type) {
        case 'MS':
          return new Date(date.getFullYear(), date.getMonth(), 1);
        case 'ME':
          return new Date(date.getFullYear(), date.getMonth() + 1, 0);
        case 'YS':
          return new Date(date.getFullYear(), 0, 1);
        case 'YE':
          return new Date(date.getFullYear(), 11, 31);
        default:
          return date;
      }
    };

    currentDate = adjustDate(currentDate, interval);

    // Function to increment date based on interval
    const incrementDate = (date: Date, interval: IntervalType, steps: number) => {
      const newDate = new Date(date);
      switch (interval) {
        case 'D':
          newDate.setUTCDate(newDate.getUTCDate() + steps);
          break;
        case 'W':
          newDate.setUTCDate(newDate.getUTCDate() + 7 * steps);
          break;
        case 'M':
          newDate.setUTCMonth(newDate.getUTCMonth() + steps);
          break;
        case 'MS':
          return adjustDate(new Date(newDate.getFullYear(), newDate.getMonth() + steps, 1), 'MS');
        case 'ME':
          return adjustDate(new Date(newDate.getFullYear(), newDate.getMonth() + steps, 1), 'ME');
        case 'Y':
          newDate.setUTCFullYear(newDate.getUTCFullYear() + steps);
          break;
        case 'YS':
        case 'YE':
          newDate.setUTCFullYear(newDate.getUTCFullYear() + steps);
          return adjustDate(newDate, interval);
      }
      return newDate;
    };

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate = incrementDate(currentDate, interval, steps);
    }

    if (latest && currentDate > endDate) {
      dateArray.push(new Date(currentDate));
    }

    return dateArray;
  } catch (err) {
    Logger.error('dateRange() -> unexpected error', err);
    return [];
  }
}

type IntervalType = 'D' | 'W' | 'M' | 'MS' | 'ME' | 'Y' | 'YS' | 'YE';

type DateRangeOptions = {
  interval: IntervalType;
  steps: number;
  latest: boolean;
};

/**
 * Sorts an array of objects by a specific key in ascending order.
 *
 * @example
 *
 * const data = [{ a: 2 }, { a: 3 }, { a: 1 }];
 * sortBy(data, 'a'); // returns [{ a: 1 }, { a: 2 }, { a: 3 }]
 *
 * @param arr the array of objects to sort.
 * @param key the key to sort by.
 *
 * @returns a new array sorted by the specified key.
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
 * @param arr the array.
 *
 * @returns a new duplicate-free array.
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
 * @param str the string to convert.
 *
 * @returns the converted string.
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
 * toPascalCase(text) // returns 'HelloWorld';
 *
 * @param str the string to convert.
 *
 * @returns the converted string.
 */
export function toPascalCase(str: string) {
  return str.replace(/(\w)(\w*)/g, (_, first, rest) => `${first.toUpperCase()}${rest.toLowerCase()}`);
}

/**
 * Converts a string to snake case.
 *
 * @example
 *
 * const text = 'Hello World';
 * toSnakeCase(text) // returns 'hello_world';
 *
 * @param str the string to convert.
 *
 * @returns the converted string.
 */
export function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s_]+/g, '_')
    .toLowerCase();
}

/**
 * Truncates a string if it is longer than the given maximum string length. The last characters of the truncated string are replaced with the ellipsis sign "…".
 *
 * @example
 *
 * const text = 'Hello World';
 * truncate(text, 5); // returns 'Hello…'
 *
 * @param str the string to truncate.
 * @param limit the maximum string length.
 * @param completeWords if true, the string is truncated to the nearest word, instead of character.
 * @param ellipsis the characters to end the truncated string with.
 *
 * @returns the truncated string.
 */
export function truncate(str: string, limit = 25, completeWords = false, ellipsis = '…'): string {
  let _limit = limit;
  if (completeWords) {
    _limit = str.substring(0, _limit).lastIndexOf(' ');
  }

  return str.length > _limit ? `${str.substring(0, _limit)}${ellipsis}` : str;
}

/**
 * Performs a fuzzy search on an array of objects, checking all keys and values for a match with the search string.
 *
 * @param arr - The array of objects to search.
 * @param str - The string to search for.
 * @param tone - Degree of similarity between 0 and 1.
 * @param chunkSize - The size of chunks used for similarity comparison.
 *
 * @returns The filtered array of objects that match the search string.
 */
export function findBy<T extends Record<string, unknown>>(arr: T[], str: string, tone = 0.44, chunkSize = 2): T[] {
  if (!str) return [];
  const lowerStr = str.toLowerCase();

  return arr.filter((obj) => hasValue(obj, lowerStr, tone, chunkSize));
}

/**
 * Recursively checks if an object contains a value similar to the search string.
 *
 * @param obj - The object to search within.
 * @param str - The search string.
 * @param tone - The similarity threshold.
 * @param chunkSize - The chunk size for comparison.
 *
 * @returns Whether the object contains a matching value.
 */
function hasValue<T extends Record<string, unknown>>(obj: T, str: string, tone = 1, chunkSize = 2): boolean {
  return Object.entries(obj).some(([key, value]) => {
    if (value === null || value === undefined) return false;

    if (Array.isArray(value)) {
      return value.some((val) => hasValue(val, str, tone, chunkSize));
    }

    if (typeof value === 'object') {
      return hasValue(value as Record<string, unknown>, str, tone, chunkSize);
    }

    return isSimilar(String(value), str, chunkSize) >= tone || isSimilar(key, str, chunkSize) >= tone;
  });
}

/**
 * Calculates similarity between two strings based on shared character pairs.
 *
 * @param str1 - First string.
 * @param str2 - Second string.
 * @param chunkSize - Number of characters in each chunk.
 *
 * @returns Similarity score between 0 and 1.
 */
export function isSimilar(str1: string, str2: string, chunkSize = 2): number {
  if (!str1 || !str2) return 0.0;

  const [chunks1, chunks2] = [str1, str2].map((s) => toChunks(s, chunkSize));

  const chunkSet = new Set(chunks1);
  let matches = 0;

  for (const chunk of chunks2) {
    if (chunkSet.delete(chunk)) {
      matches++;
    }
  }

  return Number.parseFloat((matches / chunks2.length).toFixed(2));
}

/**
 * Splits a string into overlapping chunks of a given size.
 *
 * @param str - The input string.
 * @param size - The chunk size.
 *
 * @returns An array of string chunks.
 */
function toChunks(str: string, size: number): string[] {
  const padded = ` ${str.toLowerCase()} `;
  return Array.from({ length: padded.length - size + 1 }, (_, i) => padded.slice(i, i + size));
}
