import axios, { AxiosHeaders, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { Logger } from './logger.util';

export type HttpRequestConfig = AxiosRequestConfig & { id?: string; cancelable?: boolean };

type ContextProps = {
  expiresIn?: number;
  headers?: AxiosHeaders;
  params?: Record<string, string | number | undefined>;
  timeout?: number;
  url?: string;
};

type RequestData<T> = {
  controller: AbortController;
  expires: ReturnType<typeof setTimeout>;
  request: Promise<AxiosResponse<T>>;
  status: RequestStatus;
  timeout: ReturnType<typeof setTimeout>;
};

const REQUEST_TIMEOUT = 1000 * 7; // 7 seconds
const CACHE_EXPIRES_IN = 1000 * 60 * 2; // 2 minutes

enum TypeSymbol {
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

const requestData: Record<string, RequestData<unknown>> = {};

const log = (type: keyof typeof TypeSymbol, req: AxiosRequestConfig, res: unknown, time = 0) => {
  const elapsed = Math.floor(Date.now() - time);
  const logType = type.toLowerCase() as Lowercase<keyof typeof TypeSymbol>;
  const logUrl = (req.url?.replace(/http(s)?:\/\//, '').split('/') as string[]) ?? [];

  logUrl.shift();

  Logger[logType](`HTTP::${req.method?.toUpperCase()}(…/${logUrl.join('/')}) ${TypeSymbol[type]} ${elapsed}ms`, res);
};

function deleteRequest(id: string) {
  if (requestData[id]?.status === RequestStatus.PENDING) requestData[id].controller.abort('Request aborted');

  clearTimeout(requestData[id].expires);
  clearTimeout(requestData[id].timeout);
  delete requestData[id];
}

const makeRequest = <T>(config: HttpRequestConfig, context?: ContextProps): Promise<AxiosResponse<T>> => {
  const { id = JSON.stringify(config), headers, params, cancelable, ...cfg } = config;
  const data = requestData[id];

  if ((cancelable && data?.status === RequestStatus.PENDING) || data?.status === RequestStatus.ERROR) {
    deleteRequest(id);
  }

  if (!data) {
    const controller = new AbortController();

    const request = fetcher<T>(
      Object.assign({}, cfg, {
        headers: context?.headers ? { ...context.headers, ...headers } : headers,
        params: context?.params ? { ...context.params, ...params } : params,
        paramsSerializer: {
          encode: (parameter: string | number | boolean) => encodeURIComponent(parameter),
        },
        signal: controller.signal,
        url: context?.url ? `${context.url}/${config.url}` : config.url,
      }),
      id,
    );

    requestData[id] = {
      controller,
      expires: setTimeout(() => delete requestData[id], context?.expiresIn ?? CACHE_EXPIRES_IN),
      request,
      status: RequestStatus.PENDING,
      timeout: setTimeout(() => {
        if (requestData[id].status === RequestStatus.PENDING) {
          controller.abort('Request timeout');
        }
      }, context?.timeout ?? REQUEST_TIMEOUT),
    };
  }

  return requestData[id].request as Promise<AxiosResponse<T>>;
};

export async function fetcher<T>(config: AxiosRequestConfig, id?: string): Promise<AxiosResponse<T>> {
  const time = Date.now();

  return axios(config)
    .then((res) => {
      log('SUCCESS', config, res.data, time);

      if (id) {
        requestData[id].status = RequestStatus.SUCCESS;
      }

      return res as AxiosResponse<T>;
    })
    .catch((error) => {
      log('ERROR', config, error, time);

      if (id) {
        requestData[id].status = RequestStatus.ERROR;
      }

      throw error;
    })
    .finally(() => {
      if (id && config.method !== RequestMethod.GET) {
        deleteRequest(id);
      }
    });
}

export function createHttpService(context = {} as ContextProps) {
  return {
    delete<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.DELETE, ...config }, context);
    },
    get<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.GET, ...config }, context);
    },
    patch<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.PATCH, ...config }, context);
    },
    post<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
      return makeRequest<T>({ url, method: RequestMethod.POST, ...config }, context);
    },
    put<T>(url: string, config?: HttpRequestConfig): Promise<AxiosResponse<T>> {
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
