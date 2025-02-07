import * as homeModule from './home';
import * as userModule from './user';

export const paths = { home: homeModule.paths, user: userModule.paths };
export const routes = [...homeModule.routes, ...userModule.routes];

export default {
  paths,
  routes,
};
