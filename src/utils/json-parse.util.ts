import { Logger } from '@/utils/logger.util';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const jsonParse = <T, K>(data: K, property?: keyof K): T | undefined => {
  try {
    const value = property ? data[property] : data;
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (err) {
    Logger.error('jsonParse() -> failed to parse object', err);
    return undefined;
  }
};
