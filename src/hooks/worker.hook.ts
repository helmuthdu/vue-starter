/*
 * @example
 * const resolve = (val: number): number => {
 *   const fib = (i: number): number => (i <= 1 ? i : fib(i - 1) + fib(i - 2));
 *   return fib(val);
 * };
 * const [value, calc] = useWorker('W1', resolve, 0);
 */

import { Logger } from '@/utils';
import { onBeforeUnmount, Ref, ref } from 'vue';

type UseWorker<T> = [Ref<T>, (data: any) => void];

const workers = new Map<string | number, Worker>();

const useWorkerInit = <T>(opts: {
  code?: boolean;
  defaultValue?: T;
  id: string | number;
  terminate?: boolean;
  url?: string;
  worker?: Worker;
}): UseWorker<T> => {
  const worker = ref<Worker>();
  const message = ref<T>(opts.defaultValue as T);

  const onMessage = (evt: MessageEvent) => {
    message.value = evt.data;
  };

  const onError = (evt: ErrorEvent) => {
    Logger.error(`[WORKER|${opts.id}] Message Failed`, evt);
  };

  const createWorker = () => {
    if (workers.has(opts.id)) {
      worker.value = workers.get(opts.id);
    } else if (opts.worker) {
      worker.value = opts.worker;
    } else if (opts.url) {
      worker.value = new Worker(opts.url);
    }
    workers.set(opts.id, worker.value as Worker);
  };

  const setupWorker = () => {
    createWorker();
    if (worker.value) {
      worker.value.addEventListener('message', onMessage, false);
      worker.value.addEventListener('error', onError, false);
    } else {
      Logger.error(`[WORKER|${opts.id}] Missing id, url or worker`);
    }
  };

  const terminateWorker = () => {
    Logger.info(`[WORKER|${opts.id}] Terminate`);
    if (worker.value) {
      worker.value.removeEventListener('message', onMessage);
      worker.value.removeEventListener('error', onError);
      if (!opts.terminate) {
        worker.value.terminate();
      }
      worker.value = undefined;
    }
    if (opts.code && opts.url) {
      window.URL.revokeObjectURL(opts.url);
    }
    workers.delete(opts.id);
  };

  const postMessage = (data: any) => {
    Logger.info(`[WORKER|${opts.id}] Post Message`, data);
    if (worker.value) {
      worker.value.postMessage(data);
    } else {
      Logger.error(`[WORKER|${opts.id}] Not found`);
    }
  };

  setupWorker();
  onBeforeUnmount(() => {
    terminateWorker();
  });

  return [message as Ref<T>, postMessage];
};

export const useWorker = <T>(id: string, resolve: (data: any) => T, defaultValue?: T): UseWorker<T> => {
  const resolveString = resolve.toString();
  const webWorkerTemplate = `self.onmessage = function(e) { self.postMessage((${resolveString})(e.data)); }`;
  const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
  const url = window.URL.createObjectURL(blob);

  return useWorkerInit<T>({ code: true, defaultValue, id, terminate: true, url });
};

export const useWorkerFromUrl = <T>(id: string, url: string, defaultValue?: T): UseWorker<T> =>
  useWorkerInit({ defaultValue, id, terminate: true, url });

export const useWorkerFromWorker = <T>(id: string, worker: Worker, defaultValue?: T): UseWorker<T> =>
  useWorkerInit<T>({ defaultValue, id, worker });
