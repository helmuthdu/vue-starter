import { Logger } from '@/utils/logger.util';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken, CancelTokenSource } from 'axios';

type HttpRequestConfig = AxiosRequestConfig & { id?: string };

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

const activeRequests = {} as Record<string, { request: Promise<any>; controller: CancelTokenSource }>;

export class Http {
  static async get<T>(url: string, config?: HttpRequestConfig, latestOnly?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'get', ...config }, latestOnly);
  }

  static async post<T>(url: string, config?: HttpRequestConfig, latestOnly?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'post', ...config }, latestOnly);
  }

  static async put<T>(url: string, config?: HttpRequestConfig, latestOnly?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'put', ...config }, latestOnly);
  }

  static async patch<T>(url: string, config?: HttpRequestConfig, latestOnly?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'patch', ...config }, latestOnly);
  }

  static async delete<T>(url: string, config?: HttpRequestConfig, latestOnly?: boolean): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'delete', ...config }, latestOnly);
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

  private static async _request<T>(config: HttpRequestConfig, latestOnly?: boolean): Promise<AxiosResponse<T>> {
    const { id = this.generateRequestId(config), ...cfg } = config;

    if (activeRequests[id] && latestOnly) {
      activeRequests[id].controller.cancel();
    }

    if (!activeRequests[id]) {
      const controller = axios.CancelToken.source();
      const request = this._makeRequest(id, cfg, controller.token);
      activeRequests[id] = { request, controller };
    }

    return activeRequests[id].request;
  }

  private static _makeRequest<T>(
    id: string,
    config: AxiosRequestConfig,
    cancelToken: CancelToken
  ): Promise<AxiosResponse<T>> {
    const time = Date.now();
    return axiosInstance({ ...config, cancelToken })
      .then((res: AxiosResponse<T>) => {
        log('success', config, res.data, time);
        return res;
      })
      .catch((error: AxiosError<T>) => {
        log('error', config, error, time);
        throw error;
      })
      .finally(() => {
        delete activeRequests[id];
      });
  }

  private static generateRequestId(options: any): string {
    return `${JSON.stringify(options)}`;
  }
}

export default Http;
