import { Logger } from '@/utils/logger.util';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';
import { type Ref, ref, watch } from 'vue';

export const useStorage = <T>(key: string, defaultValue?: T, session = false): Ref<T> => {
  const getItem = () => {
    const item = getStorageItem<T>(key);

    if (item === undefined && defaultValue) {
      setStorageItem(key, defaultValue, session);

      return defaultValue;
    }

    return item as T;
  };

  const storage = ref(getItem()) as Ref<T>;

  watch(
    storage,
    (state: T) => {
      Logger.info(`[STORAGE] watch('${key}')`, state);
      setStorageItem(key, state);
    },
    { deep: true },
  );

  return storage;
};
