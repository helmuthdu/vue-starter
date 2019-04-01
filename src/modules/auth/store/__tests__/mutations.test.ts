import { mutations } from '../mutations';
import { state, State } from '../state';
import { AuthActions } from '../types';

describe('auth/store -> reducer', () => {
  let authState: State;

  beforeEach(() => {
    authState = { ...state() };
  });

  it('should handle the initial state', () => {
    mutations[AuthActions.SET_USER](authState, {});

    expect(authState).toEqual(state());
  });

  it(`should handle ${AuthActions.SET_USER}`, () => {
    mutations[AuthActions.SET_USER](authState, {
      username: 'user_name',
      email: 'user_email',
      token: 'user_token',
      isLogged: true
    });
    expect(authState.isLogged).toEqual(true);
  });
});
