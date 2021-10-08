import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { Logger } from './logger.util';

export type HttpRequestConfig = AxiosRequestConfig & { id?: string; cancelable?: boolean };

type ContextData = Record<string, string | number | undefined>;
type ContextProps = {
  url: string;
  headers?: ContextData;
  params?: ContextData;
};

let _contexts: Record<string, ContextProps> = {};
let _defaultContext = 'api';

enum TypeSymbol {
  success = '✓',
  error = '✕'
}

const _activeRequests = {} as Record<string, { request: Promise<any>; controller: CancelTokenSource }>;

const _updateCustomProps = (values: ContextData, props: ContextData) => {
  Object.entries(values).forEach(([key, val]) => {
    if (val === undefined) {
      delete props[key];
    } else {
      props[key] = val;
    }
  });
};

const _generateId = (options: any): string => {
  return `${JSON.stringify(options)}`;
};

const _makeRequest = <T>(config: HttpRequestConfig): Promise<AxiosResponse<T>> => {
  const { id = _generateId(config), headers, params, cancelable, ...cfg } = config;

  if (_activeRequests[id] && cancelable) {
    _activeRequests[id].controller.cancel();
    delete _activeRequests[id];
  }

  if (!_activeRequests[id]) {
    const controller = axios.CancelToken.source();

    const [ctx] = Object.entries(_contexts).find(([_key, ctx]) => config.url?.includes(ctx.url)) ?? [];

    const request = fetcher(
      Object.assign({}, cfg, {
        cancelToken: controller.token,
        headers: ctx && _contexts[ctx].headers ? { ..._contexts[ctx].headers, ...headers } : headers,
        params: ctx && _contexts[ctx].params ? { ..._contexts[ctx].params, ...params } : params,
        paramsSerializer: (parameters: Record<string, string>) => new URLSearchParams(parameters).toString()
      }),
      id
    );
    _activeRequests[id] = { request, controller };
  }

  return _activeRequests[id].request;
};

const log = (type: keyof typeof TypeSymbol, req: AxiosRequestConfig, res: unknown, time = 0) => {
  const url = (req.url?.replace(/http(s)?:\/\//, '').split('/') as string[]) ?? [];
  url.shift();
  const elapsed = Math.floor(Date.now() - time);
  Logger[type](`HTTP::${req.method?.toUpperCase()}(…/${url.join('/')}) ${TypeSymbol[type]} ${elapsed}ms`, res);
};

export const fetcher = <T>(config: AxiosRequestConfig, id?: string): Promise<AxiosResponse<T>> => {
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
        delete _activeRequests[id];
      }
    });
};

export const Http = {
  initialize({
    contexts = _contexts,
    defaultContext = _defaultContext
  }: {
    contexts?: Record<string, ContextProps>;
    defaultContext: string;
  }) {
    _contexts = contexts;
    _defaultContext = defaultContext;
  },
  get<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'get', ...config });
  },
  post<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'post', ...config });
  },
  put<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'put', ...config });
  },
  patch<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'patch', ...config });
  },
  delete<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return _makeRequest<T>({ url, method: 'delete', ...config });
  },
  setHeaders(headers: ContextData, context = _defaultContext): void {
    _updateCustomProps(headers, _contexts[context].headers as ContextData);
  },
  setParams(params: ContextData, context = _defaultContext): void {
    _updateCustomProps(params, _contexts[context].params as ContextData);
  },
  setUrl(url: string, context = _defaultContext): void {
    _contexts[context].url = url;
  },
  formatUrl(url: string, context = _defaultContext): string {
    return `${_contexts[context].url}/${url}`;
  },
  setDefaultContext(name: string) {
    _defaultContext = name;
  }
};
