import { mutations } from '../mutations';
import { state, State } from '../state';
import { AUTHENTICATION_SET_USER } from '../types';

describe('auth/store -> reducer', () => {
  let authState: State;

  beforeEach(() => {
    authState = { ...state() };
  });

  it('should handle the initial state', () => {
    mutations[AUTHENTICATION_SET_USER](authState, {});

    expect(authState).toEqual(state());
  });

  it(`should handle ${AUTHENTICATION_SET_USER}`, () => {
    mutations[AUTHENTICATION_SET_USER](authState, {
      username: 'user_name',
      email: 'user_email',
      token: 'user_token',
      isLogged: true,
    });
    expect(authState.isLogged).toEqual(true);
  });
});
