import * as auth from './modules/auth';

export type State = Readonly<{
  [auth.name]: auth.State;
}>;

export { auth };
