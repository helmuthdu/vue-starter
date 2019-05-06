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

  it(`should handle ${UserActionTypes.LOGIN}`, async () => {
    // apply mutation
    await actions[UserActionTypes.LOGIN]({ commit } as any, { username: 'helmuthdu', email: 'helmuthdu@gmail.com' });
    // assert result
    expect(authState.isLogged).toBe(true);
  });

  it(`should handle ${UserActionTypes.LOGOUT}`, () => {
    // apply mutation
    actions[UserActionTypes.LOGOUT]({ commit } as any);
    // assert result
    expect(authState.isLogged).toBe(false);
  });
});
