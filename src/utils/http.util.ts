import { Logger } from './logger.util';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import qs from 'qs';

export type HttpRequestConfig = AxiosRequestConfig & { id?: string; cancelable?: boolean; customHeaders?: boolean };

enum TypeSymbol {
  success = '✓',
  error = '✕'
}

const log = (type: keyof typeof TypeSymbol, req: AxiosRequestConfig, res: unknown, time: number) => {
  const url = (req.url?.replace(/http(s)?:\/\//, '').split('/') as string[]) ?? [];
  url.shift();
  const timestamp = Logger.getTimestamp();
  Logger.groupCollapsed(`${req.method?.toUpperCase()}(…/${url.join('/')}) ${TypeSymbol[type]}`, `HTTP`, time);
  Logger.setTimestamp(false);
  Logger.info('REQUEST', req);
  if (type === 'error') {
    Logger.error(`XHR error ${req.method?.toUpperCase()} ${req.url}`, res);
  } else {
    Logger.success('RESPONSE', res);
  }
  Logger.setTimestamp(timestamp);
  Logger.groupEnd();
};

const activeRequests = {} as Record<string, { request: Promise<any>; controller: CancelTokenSource }>;

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

const _customHeaders: Record<string, string | number> = {};

const _generateId = (options: any): string => {
  return `${JSON.stringify(options)}`;
};

const _request = <T>(id: string, config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
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
};

const _createRequest = <T>(config: HttpRequestConfig): Promise<AxiosResponse<T>> => {
  const { id = _generateId(config), headers = defaultHeaders, cancelable, customHeaders = true, ...cfg } = config;

  if (activeRequests[id] && cancelable) {
    activeRequests[id].controller.cancel();
  }

  if (!activeRequests[id]) {
    const controller = axios.CancelToken.source();
    const request = _request(
      id,
      Object.assign({}, cfg, {
        cancelToken: controller.token,
        data: qs.stringify(cfg.data),
        headers: customHeaders ? { ...headers, ..._customHeaders } : headers
      })
    );
    activeRequests[id] = { request, controller };
  }

  return activeRequests[id].request;
};

export const Http = {
  get<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _createRequest<T>({ url, method: 'get', ...config });
  },
  post<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _createRequest<T>({ url, method: 'post', ...config });
  },
  put<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _createRequest<T>({ url, method: 'put', ...config });
  },
  patch<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _createRequest<T>({ url, method: 'patch', ...config });
  },
  delete<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _createRequest<T>({ url, method: 'delete', ...config });
  },
  setCustomHeaders(headers: Record<string, string | number | undefined>): void {
    Object.entries(headers).forEach(([key, val]) => {
      if (val === undefined) {
        delete _customHeaders[key];
      } else {
        _customHeaders[key] = val;
      }
    });
  }
};

export default Http;
