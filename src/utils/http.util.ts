import { Logger } from '@/utils/logger.util';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import qs from 'qs';

type HttpRequestConfig = AxiosRequestConfig & { id?: string; latestOnly?: boolean; skipCustomHeaders?: boolean };

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

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

export class Http {
  private static _headers: Record<string, string | number> = {};

  static async get<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'get', ...config });
  }

  static async post<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'post', ...config });
  }

  static async put<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'put', ...config });
  }

  static async patch<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'patch', ...config });
  }

  static async delete<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return this._request<T>({ url, method: 'delete', ...config });
  }

  static setHeaders(headers: Record<string, string | number | undefined>): void {
    Object.entries(headers).forEach(([key, val]) => {
      if (val === undefined) {
        delete this._headers[key];
      } else {
        this._headers[key] = val;
      }
    });
  }

  private static async _request<T>(config: HttpRequestConfig): Promise<AxiosResponse<T>> {
    const {
      id = this.generateRequestId(config),
      headers = defaultHeaders,
      latestOnly,
      skipCustomHeaders,
      ...cfg
    } = config;

    if (activeRequests[id] && latestOnly) {
      activeRequests[id].controller.cancel();
    }

    if (!activeRequests[id]) {
      const controller = axios.CancelToken.source();
      const request = this._makeRequest(
        id,
        Object.assign({}, cfg, {
          cancelToken: controller.token,
          data: qs.stringify(cfg.data),
          headers: skipCustomHeaders ? headers : { ...headers, ...this._headers }
        })
      );
      activeRequests[id] = { request, controller };
    }

    return activeRequests[id].request;
  }

  private static _makeRequest<T>(id: string, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const time = Date.now();
    return axios(config)
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
