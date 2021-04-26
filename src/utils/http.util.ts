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

const activeRequests = {} as Record<string, Promise<any>>;
export class Http {
  static async get<T>(
    url: string,
    req?: AxiosRequestConfig,
    fullRequest?: boolean,
    allowDuplicateRequest?: boolean
  ): Promise<T> {
    return await this.fetch<T>({ url, method: 'get', ...req }, fullRequest, allowDuplicateRequest);
  }

  static async post<T>(
    url: string,
    req?: AxiosRequestConfig,
    fullRequest?: boolean,
    allowDuplicateRequest?: boolean
  ): Promise<T> {
    return await this.fetch<T>({ url, method: 'post', ...req }, fullRequest, allowDuplicateRequest);
  }

  static async put<T>(
    url: string,
    req?: AxiosRequestConfig,
    fullRequest?: boolean,
    allowDuplicateRequest?: boolean
  ): Promise<T> {
    return await this.fetch<T>({ url, method: 'put', ...req }, fullRequest, allowDuplicateRequest);
  }

  static async patch<T>(
    url: string,
    req?: AxiosRequestConfig,
    fullRequest?: boolean,
    allowDuplicateRequest?: boolean
  ): Promise<T> {
    return await this.fetch<T>({ url, method: 'patch', ...req }, fullRequest, allowDuplicateRequest);
  }

  static async delete<T>(
    url: string,
    req?: AxiosRequestConfig,
    fullRequest?: boolean,
    allowDuplicateRequest?: boolean
  ): Promise<T> {
    return await this.fetch<T>({ url, method: 'delete', ...req }, fullRequest, allowDuplicateRequest);
  }

  private static async fetch<T>(
    req: AxiosRequestConfig,
    fullRequest?: boolean,
    allowDuplicateRequest?: boolean
  ): Promise<T> {
    const time = Date.now();
    const requestId = this.generateRequestId(req);

    if (allowDuplicateRequest || !activeRequests[requestId]) {
      const request = axiosInstance({ ...req })
        .then((res: AxiosResponse<T>) => {
          log('success', req, res.data, time);
          return fullRequest ? res : res.data;
        })
        .catch((error: AxiosError<T>) => {
          log('error', req, error, time);
          throw error;
        })
        .finally(() => {
          if (!allowDuplicateRequest) {
            delete activeRequests[requestId];
          }
        });

      if (!allowDuplicateRequest) {
        activeRequests[requestId] = request as Promise<T>;
      } else {
        return request as Promise<T>;
      }
    }

    return activeRequests[requestId];
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

  private static generateRequestId(options: any): string {
    return `${JSON.stringify(options)}`;
  }
}

export default Http;
