import { Logger } from '@/utils';
import { type Ref, ref } from 'vue';

export enum PromiseStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export function usePromise<T>() {
  let resolve: (value: T | PromiseLike<T>) => void = () => {};
  let reject: (reason?: unknown) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

export const usePledge = <T>(fn: (...args: unknown[]) => Promise<T>, defaultValue?: T) => {
  const value = ref(defaultValue) as Ref<T>;
  const status = ref<PromiseStatus>(PromiseStatus.IDLE);
  const run = async (...args: unknown[]) => {
    try {
      status.value = PromiseStatus.PENDING;
      value.value = await fn(...args);
      status.value = PromiseStatus.RESOLVED;
    } catch (err) {
      Logger.error('usePromise -> promise failed', err);
      status.value = PromiseStatus.REJECTED;
    }
  };

  return { value, status, run };
};
