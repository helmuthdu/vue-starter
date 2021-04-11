import { ref, Ref, UnwrapRef, watch } from 'vue';
import { getStorageItem, setStorageItem } from '@/utils/storage.util';

export const useStorage = <T>(key: string, initialValue?: T, session = false): Ref<UnwrapRef<T> | undefined> => {
  const getItem = () => {
    const item = getStorageItem<T>(key, initialValue);
    if (!item) {
      setStorageItem(key, initialValue, session);
    }
    return item;
  };

  const storage = ref<T | undefined>(getItem());

  watch(storage, (data: any) => {
    setStorageItem(key, data);
  });

  return storage;
};

export default useStorage;
