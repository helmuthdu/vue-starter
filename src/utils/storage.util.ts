import Logger from './logger.util';

const generatePrefix = (): string => {
  const appName = process.env.APP_NAME ?? '_app';
  const environment = process.env.NODE_ENV ?? 'development';
  return `${appName}_${environment.substr(0, 3)}`;
};

const getKey = (key: string) => `${generatePrefix()}_${key}`.toLowerCase();

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(getKey(key));
    sessionStorage.removeItem(getKey(key));
  } catch {
    Logger.error('Failed to remove data from storage');
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
    Logger.error('Failed to save data to storage');
  }
};

export const getStorageItem = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const item = sessionStorage.getItem(getKey(key)) ?? localStorage.getItem(getKey(key));
    return typeof item === 'string' ? JSON.parse(item) : defaultValue;
  } catch {
    Logger.error('Failed to get data from storage');
    return defaultValue;
  }
};
