import Logger from './logger.util';

const generatePrefix = (): string => {
  const appName = process.env.APP_NAME ?? '_app';
  const environment = process.env.NODE_ENV ?? 'development';
  const suffix = `-${environment.substr(0, 3)}`;
  return `${appName}_${suffix}`;
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(`${generatePrefix()}-${key}`);
    sessionStorage.removeItem(`${generatePrefix()}-${key}`);
  } catch {
    Logger.error('Failed to remove data from storage');
  }
};

export const setStorageItem = <T>(key: string, value?: T, session = false): void => {
  try {
    const storage = session ? sessionStorage : localStorage;
    const itemKey = `${generatePrefix()}-${key}`;

    if (value === undefined) {
      storage.removeItem(itemKey);
    } else {
      storage.setItem(itemKey, typeof value !== 'string' ? JSON.stringify(value) : value);
    }
  } catch {
    Logger.error('Failed to save data to storage');
  }
};

export const getStorageItem = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const prefix = generatePrefix();
    const item = sessionStorage.getItem(`${prefix}_${key}`) ?? localStorage.getItem(`${prefix}-${key}`);
    return typeof item === 'string' ? JSON.parse(item) : defaultValue;
  } catch {
    Logger.error('Failed to get data from storage');
    return defaultValue;
  }
};
