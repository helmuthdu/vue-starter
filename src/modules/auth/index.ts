import { routes } from './routes';
import * as stores from './store';

export interface State {
  [stores.name]: stores.State;
}

export { routes, stores };
