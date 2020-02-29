import { UserActionTypes } from '../types';
import { actions } from '../actions';
import { mutations } from '../mutations';
import { state, State } from '../state';

describe('user/store -> actions', () => {
  const authState: State = state();

  const commit = (type: string, payload: any) => {
    const mutation = mutations[type];
    expect(mutation).toBeDefined();
    mutation(authState, { ...payload });
  };

  it(`should handle ${UserActionTypes.SIGN_IN}`, async () => {
    // apply mutation
    await actions[UserActionTypes.SIGN_IN]({ commit } as any, { username: 'helmuthdu', email: 'helmuthdu@gmail.com' });
    // assert result
    expect(authState.isLoggedIn).toBe(true);
  });

  it(`should handle ${UserActionTypes.SIGN_OUT}`, () => {
    // apply mutation
    actions[UserActionTypes.SIGN_OUT]({ commit } as any);
    // assert result
    expect(authState.isLoggedIn).toBe(false);
  });
});
