(global as any).localStorage = {
  store: {},
  clear() {
    this.store = {};
  },
  getItem(key: string) {
    return this.store[key] || undefined;
  },
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  },
  removeItem(key: string) {
    delete this.store[key];
  }
};
(global as any).URL.createObjectURL = jest.fn();
