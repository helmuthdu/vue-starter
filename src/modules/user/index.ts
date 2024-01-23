import { routes } from './routes';
import { paths } from './routes/paths';
import * as stores from './stores';

export type State = Readonly<{
  user: typeof stores.user.state;
}>;

export { paths, routes, stores };
