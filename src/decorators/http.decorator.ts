import { AxiosError, AxiosResponse } from 'axios';
import { beforeMethod, Metadata } from 'kaop-ts';
import http from '../utils/http.util';

type httpRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const httpDecorator = Symbol.for('Http');

export const Http = <T = any>(method: httpRequestMethod, ...args: any[]) =>
  beforeMethod((meta: Metadata<AxiosResponse<T>>) =>
    (http[method] as any)(...args.map((arg: any) => (typeof arg === 'function' ? arg(meta.scope) : arg)))
      .then((res: AxiosResponse<T>) => {
        if (meta.args.length && meta.args[meta.args.length - 1] === httpDecorator) {
          const data = Array.isArray(meta.args[2]) ? [...meta.args[2], res] : [meta.args[2], res];
          meta.args = [meta.args[0], meta.args[1], data];
        } else {
          meta.args = [meta.args, null, res, httpDecorator];
        }
        meta.commit();
      })
      .catch((err: AxiosError) => {
        meta.args = [meta.args, err, null, httpDecorator];
        meta.commit();
      })
  );
