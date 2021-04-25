import * as mainModule from './main';
import * as userModule from './user';

export type State = userModule.State;

export const paths = { main: mainModule.paths, user: userModule.paths };
export const routes = [...mainModule.routes, ...userModule.routes];
export const stores = { ...userModule.stores };

export default {
  paths,
  routes,
  stores
};
