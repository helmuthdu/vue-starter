/*
 * @example
 * const resolve = (val: number): number => {
 *   const fib = (i: number): number => (i <= 1 ? i : fib(i - 1) + fib(i - 2));
 *   return fib(val);
 * };
 * const [value, calc] = useWorkerFromScript(resolve);
 */

import { Logger } from '@/utils';
import { onBeforeUnmount, Ref, ref } from 'vue';

type UseWorker<T> = [Ref<T>, (data: any) => void];

const workers = new Map<string | number, Worker>();

const useWorker = <T>(opts: {
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
    Logger.error('[WORKER] Message Failed', evt);
  };

  const createWorker = () => {
    if (workers.has(opts.id)) {
      Logger.warning('[WORKER] Worker already registered');
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
      worker.value.onmessage = onMessage;
      worker.value.onerror = onError;
    } else {
      Logger.error('[WORKER] Missing url or worker');
    }
  };

  const terminateWorker = () => {
    Logger.info('[WORKER] Terminate Worker');
    if (worker.value) {
      if (!opts.worker) {
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
    Logger.info('[WORKER] Post Message', data);
    if (worker.value) {
      worker.value.postMessage(data);
    } else {
      Logger.error('[WORKER] Worker not found');
    }
  };

  setupWorker();
  onBeforeUnmount(() => {
    terminateWorker();
  });

  return [message as Ref<T>, postMessage];
};

export const useWorkerFromUrl = <T>(url: string, defaultValue?: T): UseWorker<T> =>
  useWorker({ defaultValue, id: url, terminate: true, url });

export const useWorkerFromCode = <T>(
  resolve: (data: any) => T,
  defaultValue?: T,
  id = 'aGVsbXV0aGR1'
): UseWorker<T> => {
  const resolveString = resolve.toString();
  const webWorkerTemplate = `self.onmessage = function(e) { self.postMessage((${resolveString})(e.data)); }`;
  const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
  const url = window.URL.createObjectURL(blob);

  return useWorker<T>({ code: true, defaultValue, id, terminate: true, url });
};

export const useWorkerFromWorker = <T>(worker: Worker, defaultValue?: T, id = 'aGVsbXV0aGR1'): UseWorker<T> =>
  useWorker<T>({ defaultValue, id, worker });
