export interface WebWorkerService {
  run<T, K extends any>(workerFunction: (input: any) => T, data?: K): Promise<T>;
  runUrl<T, K extends any>(url: string, data?: K): Promise<T>;
  terminate<T>(promise: Promise<T>): Promise<T>;
  getWorker(promise: Promise<any>): Worker;
}

export class WebWorker implements WebWorkerService {
  private workerFunctionToUrlMap = new WeakMap<(input: any) => any, string>();
  private promiseToWorkerMap = new WeakMap<Promise<any>, Worker>();

  public run<T, K extends any>(workerFunction: (input: any) => T, data?: K): Promise<T> {
    const url = this.getOrCreateWorkerUrl<T>(workerFunction);
    return this.runUrl(url, data);
  }

  public runUrl<T, K extends any>(url: string, data?: K): Promise<T> {
    const worker = new Worker(url);
    const promise = this.createPromiseForWorker<T, K>(worker, data);
    const promiseCleaner = this.createPromiseCleaner(promise);

    this.promiseToWorkerMap.set(promise, worker);

    promise.then(promiseCleaner).catch(promiseCleaner);

    return promise;
  }

  public terminate<T>(promise: Promise<T>): Promise<T> {
    return this.removePromise(promise);
  }

  public getWorker(promise: Promise<any>): Worker {
    return this.promiseToWorkerMap.get(promise) as Worker;
  }

  private createPromiseForWorker<T, K extends any>(worker: Worker, data?: K) {
    return new Promise<T>((resolve, reject) => {
      worker.addEventListener('message', event => resolve(event.data));
      worker.addEventListener('error', reject);
      worker.postMessage(data);
    });
  }

  private getOrCreateWorkerUrl<T>(fn: (input: any) => T): string {
    if (!this.workerFunctionToUrlMap.has(fn)) {
      const url = this.createWorkerUrl(fn);
      this.workerFunctionToUrlMap.set(fn, url);
      return url;
    }
    return this.workerFunctionToUrlMap.get(fn) as string;
  }

  private createWorkerUrl<T>(resolve: (input: any) => T): string {
    const resolveString = resolve.toString();
    const webWorkerTemplate = `
      self.addEventListener('message', function(e) {
        postMessage((${resolveString})(e.data));
      });`;
    const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
    return URL.createObjectURL(blob);
  }

  private createPromiseCleaner<T>(promise: Promise<T>): (input: any) => T {
    return event => {
      this.removePromise(promise);
      return event;
    };
  }

  private removePromise<T>(promise: Promise<T>): Promise<T> {
    const worker = this.promiseToWorkerMap.get(promise);
    if (worker) {
      worker.terminate();
    }
    this.promiseToWorkerMap.delete(promise);
    return promise;
  }
}

export const webWorker = new WebWorker();
