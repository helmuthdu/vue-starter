global.localStorage = {
  store: {},
  clear() {
    this.store = {};
  },
  getItem(key) {
    return this.store[key] || undefined;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  }
};
global.URL.createObjectURL = jest.fn();
