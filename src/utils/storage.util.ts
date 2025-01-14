import { Logger } from './logger.util';

const generatePrefix = (): string => {
  const appName = (import.meta.env.VITE_NAME as string) ?? 'app';
  const environment = (import.meta.env.NODE_ENV as string) ?? 'dev';

  return `${appName}_${environment.substring(0, 3)}`;
};

const getKey = (key: string) => `${generatePrefix()}_${key}`.toLowerCase();

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(getKey(key));
    sessionStorage.removeItem(getKey(key));
  } catch {
    Logger.error(`Failed to remove item "${getKey(key)}" from storage`);
  }
};

export const setStorageItem = <T>(key: string, value?: T, session = false): void => {
  try {
    const storage = session ? sessionStorage : localStorage;

    if (value === undefined) {
      storage.removeItem(getKey(key));
    } else {
      storage.setItem(getKey(key), typeof value !== 'string' ? JSON.stringify(value) : value);
    }
  } catch {
    Logger.error(`Failed to save item "${getKey(key)}" into storage`);
  }
};

export const getStorageItem = <T>(key: string, defaultValue?: T, parser?: (val: T) => T): T => {
  if (typeof window === 'undefined') {
    return defaultValue as T;
  }

  const item = sessionStorage.getItem(getKey(key)) ?? localStorage.getItem(getKey(key));

  try {
    return item ? (parser ? parser(JSON.parse(item)) : JSON.parse(item)) : defaultValue;
  } catch {
    if (item !== undefined) {
      return item as unknown as T;
    }

    Logger.warn(`Storage item "${getKey(key)}" not available`);

    return defaultValue as T;
  }
};
