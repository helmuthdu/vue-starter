import { type Ref, ref } from 'vue';

export const usePromise = <T>(fn: (...args: unknown[]) => Promise<T>, defaultValue?: T) => {
  const result = ref(defaultValue) as Ref<T>;
  const loading = ref(false);
  const error = ref<unknown>(null);
  const run = async (...args: unknown[]) => {
    loading.value = true;
    error.value = null;
    result.value = defaultValue as T;

    try {
      result.value = await fn(...args);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { result, loading, error, run };
};
