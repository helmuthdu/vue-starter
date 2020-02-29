import { routes } from './routes';
import * as stores from './stores';

export type State = Readonly<{
  [stores.user.name]: stores.user.State;
}>;

export { routes, stores };
