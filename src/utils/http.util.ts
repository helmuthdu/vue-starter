import { Logger } from '@/utils/logger.util';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create();

const log = (type: keyof typeof Logger, req: AxiosRequestConfig, res: unknown, time: number) => {
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
  static async get<T>(url: string, req?: AxiosRequestConfig, duplicated?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'get', ...req }, duplicated);
  }

  static async post<T>(url: string, req?: AxiosRequestConfig, duplicated?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'post', ...req }, duplicated);
  }

  static async put<T>(url: string, req?: AxiosRequestConfig, duplicated?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'put', ...req }, duplicated);
  }

  static async patch<T>(url: string, req?: AxiosRequestConfig, duplicated?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'patch', ...req }, duplicated);
  }

  static async delete<T>(url: string, req?: AxiosRequestConfig, duplicated?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'delete', ...req }, duplicated);
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

  private static async _request<T>(req: AxiosRequestConfig, duplicated?: boolean): Promise<AxiosResponse<T>> {
    const requestId = this.generateRequestId(req);

    if (duplicated || !activeRequests[requestId]) {
      const request = this._makeRequest(requestId, req, duplicated);

      if (!duplicated) {
        activeRequests[requestId] = request;
      }

      return request as Promise<AxiosResponse<T>>;
    }

    return activeRequests[requestId];
  }

  private static _makeRequest<T>(
    requestId: string,
    req: AxiosRequestConfig,
    duplicated?: boolean
  ): Promise<AxiosResponse<T>> {
    const time = Date.now();
    return axiosInstance({ ...req })
      .then((res: AxiosResponse<T>) => {
        log('success', req, res.data, time);
        return res;
      })
      .catch((error: AxiosError<T>) => {
        log('error', req, error, time);
        throw error;
      })
      .finally(() => {
        if (!duplicated) {
          delete activeRequests[requestId];
        }
      });
  }

  private static generateRequestId(options: any): string {
    return `${JSON.stringify(options)}`;
  }
}

export default Http;
