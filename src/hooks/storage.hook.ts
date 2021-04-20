import { ref, Ref, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';
import { Logger } from '@/utils';

export const useStorage = <T>(key: string, defaultValue?: T, session = false): Ref<T> => {
  const getItem = () => {
    const item = getStorageItem<T>(key);
    if (item === undefined && defaultValue) {
      setStorageItem(key, defaultValue, session);
      return defaultValue;
    }
    return item;
  };

  const storage = ref(getItem()) as Ref<T>;

  watch(
    storage,
    (state: T) => {
      Logger.info(`[STORAGE] watch('${key}')`, state);
      setStorageItem(key, state);
    },
    { deep: true }
  );

  return storage;
};
