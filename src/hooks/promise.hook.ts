import { ref } from '@vue/composition-api';

export const usePromise = <T>(fn: (...args: any) => Promise<T>, defaultValue: T = null as any) => {
  const result = ref<T>(defaultValue);
  const loading = ref(false);
  const error = ref<unknown>(null);
  const run = async (...args) => {
    loading.value = true;
    error.value = null;
    result.value = defaultValue;
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
