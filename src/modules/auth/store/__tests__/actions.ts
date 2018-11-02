import { actions } from '../actions';
import { mutations } from '../mutations';

describe('store: authentication -> actions', () => {
  const state = { token: '', username: '', email: '', isLogged: false };
  const commit = (type: string, payload: any) => {
    const mutation = mutations[type];
    expect(mutation).toBeDefined();
    mutation(state, { ...payload });
  };

  test('AUTH_LOGIN', () => {
    // apply mutation
    actions.AUTHENTICATION_LOGIN({ state, commit } as any, { username: 'helmuthdu', email: 'helmuthdu@gmail.com' });
    // assert result
    expect(state.isLogged).toBe(true);
  });

  test('AUTH_LOGOUT', () => {
    // apply mutation
    actions.AUTHENTICATION_LOGOUT({ state, commit } as any);
    // assert result
    expect(state.isLogged).toBe(false);
  });
});
