import { Logger } from './logger.util';

const generatePrefix = (): string => {
  const appName = (process.env.APP_NAME as string) ?? '_app';
  const environment = (process.env.NODE_ENV as string) ?? 'development';
  return `${appName}_${environment.substr(0, 3)}`;
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

export const getStorageItem = <T>(key: string, defaultValue?: T): T => {
  const item = sessionStorage.getItem(getKey(key)) ?? localStorage.getItem(getKey(key));
  try {
    return typeof item === 'string' ? JSON.parse(item) : defaultValue;
  } catch {
    if (item !== undefined) {
      return item as unknown as T;
    }

    Logger.error(`Storage item "${getKey(key)}" not available`);
    return defaultValue as T;
  }
};
