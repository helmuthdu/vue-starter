import * as authModule from './src/modules/auth';
import * as rootModule from './src/modules/root';

export type State = authModule.State;

export const routes = [authModule.routes, rootModule.routes];
export const stores = [authModule.stores];

export default {
  routes,
  stores
};
