import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { Logger } from './logger.util';

export type HttpRequestConfig = AxiosRequestConfig & { id?: string; cancelable?: boolean };

type ContextData = Record<string, string | number | undefined>;
type ContextProps = {
  url: string;
  headers?: ContextData;
  params?: ContextData;
};

enum TypeSymbol {
  success = '✓',
  error = '✕'
}

const _activeRequests = {} as Record<string, { request: Promise<any>; controller: CancelTokenSource }>;

const _generateId = (options: any): string => {
  return `${JSON.stringify(options)}`;
};

const _log = (type: keyof typeof TypeSymbol, req: AxiosRequestConfig, res: unknown, time = 0) => {
  const url = (req.url?.replace(/http(s)?:\/\//, '').split('/') as string[]) ?? [];
  url.shift();
  const elapsed = Math.floor(Date.now() - time);
  Logger[type](`HTTP::${req.method?.toUpperCase()}(…/${url.join('/')}) ${TypeSymbol[type]} ${elapsed}ms`, res);
};

const _makeRequest = <T>(config: HttpRequestConfig, context?: ContextProps): Promise<AxiosResponse<T>> => {
  const { id = _generateId(config), headers, params, cancelable, ...cfg } = config;

  if (_activeRequests[id] && cancelable) {
    _activeRequests[id].controller.cancel();
    delete _activeRequests[id];
  }

  if (!_activeRequests[id]) {
    const controller = axios.CancelToken.source();

    const request = fetcher(
      Object.assign({}, cfg, {
        cancelToken: controller.token,
        headers: context?.headers ? { ...context.headers, ...headers } : headers,
        params: context?.params ? { ...context.params, ...params } : params,
        paramsSerializer: (parameters: Record<string, string>) => new URLSearchParams(parameters).toString(),
        url: context?.url ? `${context.url}/${config.url}` : config.url
      }),
      id
    );
    _activeRequests[id] = { request, controller };
  }

  return _activeRequests[id].request;
};

export const fetcher = <T>(config: AxiosRequestConfig, id?: string): Promise<AxiosResponse<T>> => {
  const time = Date.now();
  return axios(config)
    .then((res: AxiosResponse<T>) => {
      _log('success', config, res.data, time);
      return res;
    })
    .catch((error: AxiosError<T>) => {
      _log('error', config, error, time);
      throw error;
    })
    .finally(() => {
      if (id) {
        delete _activeRequests[id];
      }
    });
};

export const createHttpService = (context?: ContextProps) => ({
  get<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'get', ...config }, context);
  },
  post<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'post', ...config }, context);
  },
  put<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'put', ...config }, context);
  },
  patch<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'patch', ...config }, context);
  },
  delete<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'delete', ...config }, context);
  }
});

export const Http = createHttpService();
