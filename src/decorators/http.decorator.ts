import axios, { AxiosResponse, AxiosError } from 'axios';
import { beforeMethod } from 'kaop-ts';

type httpRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const httpDecorator = Symbol.for('Http');

export const Http = (method: httpRequestMethod, ...args: any[]) =>
  beforeMethod((meta: any) => {
    // @ts-ignore
    axios[method](...args.map((arg: any) => (typeof arg === 'function' ? arg(meta.scope) : arg)))
      .then((res: AxiosResponse) => {
        if (meta.args.length && meta.args[meta.args.length - 1] === httpDecorator) {
          meta.args = [meta.args[0], meta.args[1], [meta.args[2], res.data]];
        } else {
          meta.args = [meta.args, null, res.data, httpDecorator];
        }
        meta.commit();
      })
      .catch((err: AxiosError) => {
        meta.args = [meta.args, err, null, httpDecorator];
        meta.commit();
      });
  });
