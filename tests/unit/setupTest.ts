import Vue from 'vue';

declare const global: any;

Vue.config.productionTip = false;

class LocalStorageMock {
  public store: any;

  constructor() {
    this.store = {};
  }

  public clear() {
    this.store = {};
  }

  public getItem(key: string) {
    return this.store[key] || undefined;
  }

  public setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  public removeItem(key: string) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();
