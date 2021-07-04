import * as rootModule from './root';
import * as userModule from './user';

export type State = userModule.State;

export const paths = { root: rootModule.paths, user: userModule.paths };
export const routes = [...rootModule.routes, ...userModule.routes];
export const stores = { ...userModule.stores };

export default {
  paths,
  routes,
  stores
};
