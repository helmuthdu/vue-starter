import { ActionTypes, initialState, State, store } from '../user.store';

describe('user/store -> actions', () => {
  const state: State = { ...initialState };

  const commit = (type: ActionTypes, payload: any) => {
    const mutation = (store.mutations as any)[type];
    expect(mutation).toBeDefined();
    mutation(state, { ...payload });
  };

  it(`should handle sign-in`, async () => {
    // apply mutation
    await (store.actions as any).signIn({ commit } as any, { email: 'helmuthdu@gmail.com', password: 'secret' });
    // assert result
    expect(!!state.entity.token).toBe(true);
  });

  it(`should handle sign-out`, () => {
    // apply mutation
    (store.actions as any).signOut({ commit } as any);
    // assert result
    expect(!!state.entity.token).toBe(false);
  });
});
