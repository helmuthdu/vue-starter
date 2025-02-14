import { Logger } from './logger.util';

const generatePrefix = (): string => {
  const appName = (import.meta.env.VITE_NAME as string) ?? 'app';
  const environment = (import.meta.env.NODE_ENV as string) ?? 'dev';

  return `${appName}_${environment.substring(0, 3)}`;
};

const getKey = (key: string) => `${generatePrefix()}_${key}`.toLowerCase();

export const removeStorageItem = (key: string): void => {
  setStorageItem(key, undefined);
};

export const setStorageItem = <T>(key: string, value?: T, session = false): void => {
  if (typeof window === 'undefined') return;

  const storageKey = getKey(key);

  try {
    if (value === undefined) {
      [sessionStorage, localStorage].forEach((s) => s.removeItem(storageKey));
    } else {
      const storage = session ? sessionStorage : localStorage;
      storage.setItem(storageKey, typeof value !== 'string' ? JSON.stringify(value) : value);
    }
  } catch (error) {
    Logger.error(`Failed to save item "${storageKey}" into storage: ${error}`);
  }
};

export const getStorageItem = <T>(
  key: string,
  { defaultValue, parser, session }: { defaultValue?: T; parser?: (val: T) => T; session?: boolean } = {},
): T => {
  if (typeof window === 'undefined') return defaultValue as T;

  const storage = session ? sessionStorage : localStorage;
  const storageKey = getKey(key);
  const item = storage.getItem(storageKey);

  try {
    return item ? (parser ? parser(JSON.parse(item)) : JSON.parse(item)) : defaultValue;
  } catch (error) {
    Logger.warn(`Storage item "${storageKey}" could not be parsed: ${error}`);

    return (item as unknown as T) ?? (defaultValue as T);
  }
};
