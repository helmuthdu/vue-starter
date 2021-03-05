import * as homeModule from './home';
import * as userModule from './user';

export type State = userModule.State;

export const paths = { home: homeModule.paths, user: userModule.paths };
export const routes = [...homeModule.routes, ...userModule.routes];
export const stores = { ...userModule.stores };

export default {
  paths,
  routes,
  stores
};
