import { Logger } from '@/utils/logger.util';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create();

const log = (type: keyof typeof Logger, req: AxiosRequestConfig, res: any, time: number) => {
  const url = req.url?.split('/') as string[];
  const timestamp = Logger.getTimestamp();
  Logger.groupCollapsed(
    `Http.${req.method?.toLowerCase()}('…/${url[url.length - 1]}')`,
    `HTTP|${type.toUpperCase()}`,
    time
  );
  Logger.setTimestamp(false);
  Logger.info('req: ', req);
  Logger[type]('res:' as never, res);
  Logger.setTimestamp(timestamp);
  Logger.groupEnd();
};

export class Http {
  static async get<T>(url: string, req?: AxiosRequestConfig): Promise<T> {
    return await this.fetch<T>({ url, method: 'get', ...req });
  }

  static async post<T>(url: string, req?: AxiosRequestConfig): Promise<T> {
    return await this.fetch<T>({ url, method: 'post', ...req });
  }

  static async put<T>(url: string, req?: AxiosRequestConfig): Promise<T> {
    return await this.fetch<T>({ url, method: 'put', ...req });
  }

  static async patch<T>(url: string, req?: AxiosRequestConfig): Promise<T> {
    return await this.fetch<T>({ url, method: 'patch', ...req });
  }

  static async delete<T>(url: string, req?: AxiosRequestConfig): Promise<T> {
    return await this.fetch<T>({ url, method: 'delete', ...req });
  }

  private static async fetch<T>(req: AxiosRequestConfig): Promise<T> {
    const time = Date.now();
    return axiosInstance({ ...req })
      .then((res: AxiosResponse<T>) => {
        log('success', req, res.data, time);
        return res.data;
      })
      .catch((error: AxiosError<T>) => {
        log('error', req, error, time);
        throw error;
      });
  }

  static setHeaders(headers: Record<string, string | number | undefined>): void {
    Object.entries(headers).forEach(([key, val]) => {
      if (val === undefined) {
        delete axiosInstance.defaults.headers[key];
      } else {
        axiosInstance.defaults.headers[key] = val;
      }
    });
  }
}

export default Http;
