import * as rootModule from './root';
import * as userModule from './user';

export type State = userModule.State;

export const routes = [rootModule.routes, userModule.routes];
export const stores = [userModule.stores];

export default {
  routes,
  stores
};
