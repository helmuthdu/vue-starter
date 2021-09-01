import { ref } from '@vue/composition-api';

export const usePromise = fn => {
  // fn is the actual API call
  const result = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const run = async (...args) => {
    // Args is where we send in searchInput
    loading.value = true;
    error.value = null;
    result.value = null;
    try {
      result.value = await fn(...args); // Passing through the SearchInput
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };
  return { result, loading, error, run };
};
