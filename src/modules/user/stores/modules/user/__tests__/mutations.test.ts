import { mutations } from '../mutations';
import { state, State } from '../state';
import { UserActionTypes } from '../types';

describe('user/store -> reducer', () => {
  let authState: State;

  beforeEach(() => {
    authState = { ...state() };
  });

  it('should handle the initial state', () => {
    mutations[UserActionTypes.SET_USER](authState, {});

    expect(authState).toEqual(state());
  });

  it(`should handle ${UserActionTypes.SET_USER}`, () => {
    mutations[UserActionTypes.SET_USER](authState, {
      username: 'user_name',
      email: 'user_email',
      token: 'user_token',
      isLogged: true
    });
    expect(authState.isLogged).toEqual(true);
  });
});
