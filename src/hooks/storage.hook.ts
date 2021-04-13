import { ref, Ref, UnwrapRef, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';

export const useStorage = <T>(key: string, initialValue?: T, session = false): Ref<UnwrapRef<T> | undefined> => {
  const getItem = () => {
    const item = getStorageItem<T>(key);
    if (!item && initialValue) {
      setStorageItem(key, initialValue, session);
      return initialValue;
    }
    return item;
  };

  const storage = ref<T | undefined>(getItem());

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
