import { routes } from './routes';
import { paths } from './routes/paths';
import * as store from './stores';

export type State = Readonly<{
  user: store.user.State;
}>;

const stores = {
  user: store.user.store
};

export { paths, routes, stores };
