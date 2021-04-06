import Logger from '@/utils/logger.util';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BASE_DOMAIN
});

enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Patch = 'patch',
  Delete = 'delete'
}

const log = <T>(
  type: keyof typeof Logger,
  req: AxiosRequestConfig,
  res: AxiosResponse<T> | AxiosError<T>,
  time: number
) => {
  const url = req.url?.split('/') as string[];
  Logger.groupCollapsed(`Http.${req.method?.toLowerCase()}('…/${url[url.length - 1]}')`, time);
  Logger.info('url:     ', req.url);
  Logger.info('request: ', req);
  Logger[type]('response:', (res as AxiosError<T>).isAxiosError ? res : (res as AxiosResponse<T>).data);
  Logger.groupEnd();
};

type HttpResponse<T> = AxiosResponse<T> | undefined;

export class Http {
  static async get<T>(req: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return await this.fetch<T>({ method: HttpMethod.Get, ...req });
  }

  static async post<T>(req: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return await this.fetch<T>({ method: HttpMethod.Post, ...req });
  }

  static async put<T>(req: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return await this.fetch<T>({ method: HttpMethod.Put, ...req });
  }

  static async patch<T>(req: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return await this.fetch<T>({ method: HttpMethod.Patch, ...req });
  }

  static async delete<T>(req: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return await this.fetch<T>({ method: HttpMethod.Delete, ...req });
  }

  private static async fetch<T>(req: AxiosRequestConfig): Promise<HttpResponse<T>> {
    const time = Date.now();

    return axiosInstance({ ...req })
      .then((res: AxiosResponse<T>) => {
        log('success', req, res, time);
        return res;
      })
      .catch((error: AxiosError<T>) => {
        log('error', req, error, time);
        return undefined;
      });
  }

  private static setHeaders(headers?: any) {
    Object.entries(headers).forEach(([key, val]) => {
      axiosInstance.defaults.headers[key] = val;
    });
  }
}

export default Http;
