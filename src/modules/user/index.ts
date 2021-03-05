import { routes } from './routes';
import { paths } from './routes/paths';
import * as stores from './stores';

export type State = Readonly<{
  user: stores.user.State;
}>;

export { paths, routes, stores };
