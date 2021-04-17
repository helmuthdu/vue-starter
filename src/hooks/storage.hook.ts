import { ref, Ref, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';

export const useStorage = <T>(key: string, defaultValue?: T, session = false): Ref<T> => {
  const getItem = () => {
    const item = getStorageItem<T>(key);
    if (!item && defaultValue) {
      setStorageItem(key, defaultValue, session);
      return defaultValue;
    }
    return item;
  };

  const storage = ref(getItem()) as Ref<T>;

  watch(
    storage,
    (state: any) => {
      setStorageItem(key, state);
    },
    { deep: true }
  );

  return storage;
};

export default useStorage;
