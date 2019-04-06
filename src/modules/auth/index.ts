import { routes } from './routes';
import * as stores from './stores';

export interface State {
  [stores.name]: stores.State;
}

export { routes, stores };
