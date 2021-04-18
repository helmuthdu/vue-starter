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

type UseWorker<T> = [Ref<T>, (data: any) => void, Ref<Error>];

const useWorker = <T>(opts: { url?: string; worker?: Worker }): UseWorker<T> => {
  let messageData: any;
  let workerInstance: Worker | undefined;
  const message = ref<any>(undefined);
  const error = ref<any>(undefined);

  const onMessage = ({ data, timeStamp }: MessageEvent) => {
    Logger.groupCollapsed('postMessage()', 'WORKER', Date.now() - timeStamp);
    Logger.info('sent:', messageData);
    Logger.info('received:', data);
    Logger.groupEnd();
    message.value = data;
    error.value = undefined;
  };

  const onError = (err: ErrorEvent) => {
    Logger.error('[WORKER] Message Failed', err);
    error.value = err;
  };

  const createWorker = () => {
    const { url, worker } = opts;
    if (url) {
      workerInstance = new Worker(url);
    } else if (worker) {
      workerInstance = worker;
    }
  };

  const setupWorker = () => {
    createWorker();
    if (workerInstance) {
      workerInstance.addEventListener('message', onMessage, false);
      workerInstance.addEventListener('error', onError, false);
    } else {
      error.value = new Error('[WORKER] Missing url or worker instance');
      Logger.error(error.value);
    }
  };

  const terminateWorker = () => {
    if (workerInstance) {
      workerInstance.removeEventListener('message', onMessage);
      workerInstance.removeEventListener('error', onError);
      if (!opts.worker) {
        workerInstance.terminate();
      }
      messageData = undefined;
      workerInstance = undefined;
    }
  };

  const postMessage = (data: any) => {
    if (workerInstance) {
      messageData = data;
      workerInstance.postMessage(data);
    } else {
      error.value = new Error('[WORKER] Worker not found');
      Logger.error(error.value);
    }
  };

  setupWorker();
  onBeforeUnmount(() => {
    terminateWorker();
  });

  return [message as Ref<T>, postMessage, error as Ref<Error>];
};

export const useWorkerFromUrl = <T>(url: string): UseWorker<T> => useWorker({ url });

export const useWorkerFromScript = <T>(resolve: (data: any) => T): UseWorker<T> => {
  const url = ref<string>('');
  const resolveString = resolve.toString();
  const webWorkerTemplate = `self.onmessage = function(e) { self.postMessage((${resolveString})(e.data)); }`;
  const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
  url.value = window.URL.createObjectURL(blob);
  onBeforeUnmount(() => {
    window.URL.revokeObjectURL(url.value);
  });
  return useWorker<T>({ url: url.value });
};

export const useWorkerFromWorker = <T>(worker: Worker): UseWorker<T> => useWorker<T>({ worker });
