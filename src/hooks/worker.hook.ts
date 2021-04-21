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
type UseWorkerCreateOptions<T> = {
  defaultValue?: T;
  id: string | number;
  function?: boolean;
  terminate?: boolean;
  url?: string;
  worker?: Worker;
};

const workers = new Map<string | number, UseWorkerCreateOptions<any>>();

const useWorkerCreate = <T>(opts: UseWorkerCreateOptions<T>): UseWorker<T> => {
  const worker = ref<Worker>();
  const message = ref<T>(opts.defaultValue as T);

  const onMessage = (evt: MessageEvent) => {
    message.value = evt.data;
  };

  const onError = (evt: ErrorEvent) => {
    Logger.error(`[WORKER|${opts.id}] Message Failed`, evt);
  };

  const setup = () => {
    if (!opts.worker && !opts.url) {
      Logger.error(`[WORKER|${opts.id}] Missing url/worker Property`);
      return;
    }
    worker.value = opts.worker ?? new Worker(opts.url as string);
    worker.value.addEventListener('message', onMessage, false);
    worker.value.addEventListener('error', onError, false);
    workers.set(opts.id, { ...opts, worker: worker.value });
  };

  const terminate = () => {
    Logger.info(`[WORKER|${opts.id}] Terminate`);
    if (worker.value) {
      worker.value.removeEventListener('message', onMessage);
      worker.value.removeEventListener('error', onError);
      if (!opts.terminate) {
        worker.value.terminate();
      }
      if (opts.function && opts.url) {
        window.URL.revokeObjectURL(opts.url);
      }
      workers.delete(opts.id);
      worker.value = undefined;
    }
  };

  const postMessage = (data: any) => {
    Logger.info(`[WORKER|${opts.id}] Post Message`, data);
    if (worker.value) {
      worker.value.postMessage(data);
    } else {
      Logger.error(`[WORKER|${opts.id}] Not found`);
    }
  };

  setup();
  onBeforeUnmount(() => {
    terminate();
  });

  return [message as Ref<T>, postMessage];
};

export const useWorker = <T>(id: string, resolve: (data: any) => T, defaultValue?: T): UseWorker<T> => {
  let opts: UseWorkerCreateOptions<T> = { defaultValue, function: true, id, terminate: true };

  if (workers.has(id)) {
    opts = workers.get(id) as UseWorkerCreateOptions<T>;
  } else {
    const resolveString = resolve.toString();
    const webWorkerTemplate = `self.onmessage = function(e) { self.postMessage((${resolveString})(e.data)); }`;
    const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
    opts.url = window.URL.createObjectURL(blob);
  }

  return useWorkerCreate<T>(opts);
};

export const useWorkerFromUrl = <T>(id: string, url: string, defaultValue?: T): UseWorker<T> =>
  useWorkerCreate({ defaultValue, id, terminate: true, url });

export const useWorkerFromWorker = <T>(id: string, worker: Worker, defaultValue?: T): UseWorker<T> =>
  useWorkerCreate<T>({ defaultValue, id, worker });
