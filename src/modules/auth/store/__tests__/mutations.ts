import { mutations } from '../mutations';
import { initialState } from '../state';
import { AUTH_SET_USER } from '../types';

describe('auth/store -> reducer', () => {
  it('should handle the initial state', () => {
    expect(mutations(initialState, {})).toEqual(initialState);
  });

  it(`should handle ${AUTH_SET_USER}: login`, () => {
    const res = mutations(initialState, {
      type: AUTH_SET_USER,
      payload: {
        username: 'user_name',
        email: 'user_email',
        isLogged: true,
        token: 'user_token',
      },
    });
    expect(res.isLogged).toEqual(true);
  });

  it(`should handle ${AUTH_SET_USER}: logout`, () => {
    const res = mutations(initialState, {
      type: AUTH_SET_USER,
      payload: { ...initialState },
    });
    expect(res).toEqual(initialState);
  });
});
