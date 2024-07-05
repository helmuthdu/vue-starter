import { Logger } from '@/utils';
import { type Ref, ref } from 'vue';

export enum PromiseStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export const usePromise = <T>(fn: (...args: unknown[]) => Promise<T>, defaultValue?: T) => {
  const value = ref(defaultValue) as Ref<T>;
  const status = ref<PromiseStatus>();
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
