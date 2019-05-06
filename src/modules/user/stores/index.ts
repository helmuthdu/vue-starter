import * as user from './modules/user';

export type State = Readonly<{
  [user.name]: user.State;
}>;

export { user };
