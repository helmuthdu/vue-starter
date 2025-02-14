import axios, { AxiosHeaders, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { Logger } from './logger.util';

type RequestConfig = AxiosRequestConfig & { id?: string; cancelable?: boolean };

type RequestParams = Record<string, string | number | undefined>;

type ContextProps = {
  expiresIn?: number;
  headers?: AxiosHeaders;
  params?: RequestParams;
  timeout?: number;
  url?: string;
};

type RequestData<T> = {
  controller: AbortController;
  expires: ReturnType<typeof setTimeout>;
  request: Promise<AxiosResponse<T>>;
  status: RequestStatus;
};

enum ResponseTypeSymbol {
  ERROR = '✕',
  SUCCESS = '✓',
}

enum RequestMethod {
  DELETE = 'delete',
  GET = 'get',
  PATCH = 'patch',
  POST = 'post',
  PUT = 'put',
}

export enum RequestErrorType {
  BAD_REQUEST = '400|BAD_REQUEST',
  UNAUTHORIZED = '401|UNAUTHORIZED',
  FORBIDDEN = '403|FORBIDDEN',
  NOT_FOUND = '404|NOT_FOUND',
  NOT_ALLOWED = '405|NOT_ALLOWED',
  TIMEOUT = '408|TIMEOUT',
  CONFLICT = '409|CONFLICT',
  ABORTED = '499|ABORTED',
}

export enum RequestStatus {
  ERROR = 'error',
  PENDING = 'pending',
  SUCCESS = 'success',
}

const REQUEST_TIMEOUT = 1000 * 5; // 5 seconds
const CACHE_EXPIRES_IN = 1000 * 60 * 2; // 2 minutes

const HttpCache = {
  cache: {} as Record<string, RequestData<unknown>>,

  set<T>(id: string, data: RequestData<T>) {
    this.cache[id] = data;
  },

  get<T>(id: string): RequestData<T> | undefined {
    return this.cache[id] as RequestData<T>;
  },

  delete(id: string) {
    if (this.cache[id]?.status === RequestStatus.PENDING) {
      this.cache[id].controller.abort('Request aborted');
    }

    clearTimeout(this.cache[id]?.expires);
    delete this.cache[id];
  },
};

function log(type: keyof typeof ResponseTypeSymbol, req: AxiosRequestConfig, res: unknown, time = 0) {
  const elapsed = Math.floor(Date.now() - time);
  const logType = type.toLowerCase() as Lowercase<keyof typeof ResponseTypeSymbol>;
  const logUrl = req.url
    ?.replace(/http(s)?:\/\//, '')
    .split('/')
    .slice(1)
    .join('/');

  Logger[logType](`HTTP::${req.method?.toUpperCase()}(…/${logUrl}) ${ResponseTypeSymbol[type]} ${elapsed}ms`, {
    res,
    req,
    url: req.url,
  });
}

const makeRequest = <T>(config: RequestConfig, context?: ContextProps): Promise<AxiosResponse<T>> => {
  const { id = JSON.stringify(config), headers, params, cancelable, ...cfg } = config;
  const cachedRequest = HttpCache.get<T>(id);

  if (
    (cancelable && cachedRequest?.status === RequestStatus.PENDING) ||
    cachedRequest?.status === RequestStatus.ERROR
  ) {
    HttpCache.delete(id);
  }

  if (!cachedRequest) {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(context?.timeout ?? REQUEST_TIMEOUT)]);
    const request = fetcher<T>(
      Object.assign({}, cfg, {
        headers: context?.headers ? { ...context.headers, ...headers } : headers,
        params: context?.params ? { ...context.params, ...params } : params,
        paramsSerializer: {
          encode: (parameter: string | number | boolean) => encodeURIComponent(parameter),
        },
        signal,
        url: context?.url ? `${context.url}/${config.url}` : config.url,
      }),
      { id },
    );

    HttpCache.set(id, {
      controller,
      expires: setTimeout(() => HttpCache.delete(id), context?.expiresIn ?? CACHE_EXPIRES_IN),
      request,
      status: RequestStatus.PENDING,
    });
  }

  return HttpCache.get<T>(id)!.request;
};

export function buildUrl(baseUrl: string, params?: RequestParams): string {
  if (!params) return baseUrl;
  const searchParams = new URLSearchParams(params as Record<string, string>);
  return `${baseUrl}?${searchParams.toString()}`;
}

export async function fetcher<T>(
  config: AxiosRequestConfig,
  { id, retries = 2 }: { id?: string; retries?: number },
): Promise<AxiosResponse<T>> {
  const time = Date.now();

  try {
    const res = await axios(config);
    log('SUCCESS', config, res.data, time);

    if (id) {
      HttpCache.get(id)!.status = RequestStatus.SUCCESS;
    }

    return res as AxiosResponse<T>;
  } catch (error) {
    log('ERROR', config, error, time);

    if (id) {
      HttpCache.get(id)!.status = RequestStatus.ERROR;
    }

    // Retry logic for network-related errors
    if (retries > 0 && error instanceof TypeError) {
      return fetcher(config, { id, retries: retries - 1 });
    }

    throw error;
  } finally {
    if (id && config.method !== RequestMethod.GET) {
      HttpCache.delete(id);
    }
  }
}

export function createHttpService(context = {} as ContextProps) {
  return {
    delete<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.DELETE, ...config }, context);
    },
    get<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.GET, ...config }, context);
    },
    patch<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.PATCH, ...config }, context);
    },
    post<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.POST, ...config }, context);
    },
    put<T>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.PUT, ...config }, context);
    },
    setHeaders(payload: Record<string, string | undefined>): void {
      context.headers ||= new AxiosHeaders();
      const headers = Object.entries(payload);
      for (const [key, val] of headers) {
        if (val === undefined) {
          context.headers.delete(key);
        } else {
          context.headers.set(key, val);
        }
      }
    },
  };
}

export const Http = createHttpService();
