import { retry } from '@/utils/toolbox.util.ts';
import { type Ref, ref } from 'vue';

export const usePromise = <T>(
  fn: (...args: unknown[]) => T,
  defaultValue?: T,
  options?: { immediate?: boolean; retry?: number; delay?: number },
) => {
  const data = ref(defaultValue) as Ref<T>;
  const error = ref();
  const loading = ref(false);
  const ready = ref(false);

  const run = (...args: unknown[]) => {
    error.value = undefined;
    loading.value = true;
    ready.value = false;

    retry(() => fn(...args), { times: options?.retry ?? 0, delay: options?.delay ?? 0 })
      .then((val) => {
        data.value = val;
        ready.value = true;
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  if (options?.immediate) {
    run();
  }

  return { data, error, loading, ready, run };
};
