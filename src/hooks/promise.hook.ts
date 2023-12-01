import { Ref, ref } from 'vue';

export const usePromise = <T>(fn: (...args: any) => Promise<T>, defaultValue: T = null as any) => {
  const result = ref(defaultValue) as Ref<T>;
  const loading = ref(false);
  const error = ref<unknown>(null);
  const run = async (...args: any) => {
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
