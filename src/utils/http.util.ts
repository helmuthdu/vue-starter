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
  const elapsed = Math.floor(Date.now() - time);
  Logger[type](`HTTP::${req.method?.toUpperCase()}(…/${url.join('/')}) ${TypeSymbol[type]} ${elapsed}ms`, res);
};

const activeRequests = {} as Record<string, { request: Promise<any>; controller: CancelTokenSource }>;

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const customHeadersProps: Record<string, string | number> = {};

const generateId = (options: any): string => {
  return `${JSON.stringify(options)}`;
};

const makeRequest = <T>(config: HttpRequestConfig): Promise<AxiosResponse<T>> => {
  const { id = generateId(config), headers = defaultHeaders, cancelable, customHeaders = true, ...cfg } = config;

  if (activeRequests[id] && cancelable) {
    activeRequests[id].controller.cancel();
    delete activeRequests[id];
  }

  if (!activeRequests[id]) {
    const controller = axios.CancelToken.source();
    const request = fetcher(
      Object.assign({}, cfg, {
        cancelToken: controller.token,
        data: qs.stringify(cfg.data),
        headers: customHeaders ? { ...customHeadersProps, ...headers } : headers
      }),
      id
    );
    activeRequests[id] = { request, controller };
  }

  return activeRequests[id].request;
};

const fetcher = <T>(config: AxiosRequestConfig, id?: string): Promise<AxiosResponse<T>> => {
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
      if (id) {
        delete activeRequests[id];
      }
    });
};

export const Http = {
  get<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return makeRequest<T>({ url, method: 'get', ...config });
  },
  post<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return makeRequest<T>({ url, method: 'post', ...config });
  },
  put<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return makeRequest<T>({ url, method: 'put', ...config });
  },
  patch<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return makeRequest<T>({ url, method: 'patch', ...config });
  },
  delete<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return makeRequest<T>({ url, method: 'delete', ...config });
  },
  setCustomHeaders(headers: Record<string, string | number | undefined>): void {
    Object.entries(headers).forEach(([key, val]) => {
      if (val === undefined) {
        delete customHeadersProps[key];
      } else {
        customHeadersProps[key] = val;
      }
    });
  }
};
