import axios, { AxiosResponse, AxiosError } from 'axios';
import { beforeMethod } from 'kaop-ts';

type httpRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const Http = (method: httpRequestMethod, ...args: any[]) => {
  return beforeMethod((meta: any) => {
    const [params] = meta.args;
    // @ts-ignore
    axios[method](...args.map((arg: any) => (typeof arg === 'function' ? arg() : arg)))
      .then((res: AxiosResponse) => {
        meta.args = [params, null, res.data];
        meta.commit();
      })
      .catch((err: AxiosError) => {
        meta.args = [params, err, null];
        meta.commit();
      });
  });
};
