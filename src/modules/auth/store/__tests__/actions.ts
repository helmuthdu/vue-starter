import { AUTHENTICATION_LOGIN, AUTHENTICATION_LOGOUT } from '@/modules/auth/store';
import { actions } from '../actions';
import { mutations } from '../mutations';
import { state, State } from '../state';

describe('store: authentication -> actions', () => {
  const authState: State = state();

  const commit = (type: string, payload: any) => {
    const mutation = mutations[type];
    expect(mutation).toBeDefined();
    mutation(authState, { ...payload });
  };

  it(`should handle ${AUTHENTICATION_LOGIN}`, async () => {
    // apply mutation
    await actions.AUTHENTICATION_LOGIN({ commit } as any, { username: 'helmuthdu', email: 'helmuthdu@gmail.com' });
    // assert result
    expect(authState.isLogged).toBe(true);
  });

  it(`should handle ${AUTHENTICATION_LOGOUT}`, () => {
    // apply mutation
    actions.AUTHENTICATION_LOGOUT({ commit } as any);
    // assert result
    expect(authState.isLogged).toBe(false);
  });
});
