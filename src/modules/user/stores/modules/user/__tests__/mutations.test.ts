import { ActionTypes, initialState, State, store } from '../user.store';

describe('user/store -> reducer', () => {
  let state: State;

  beforeEach(() => {
    state = { ...initialState };
  });

  it('should handle the initial state', () => {
    (store.mutations as any)[ActionTypes.SET_STATE](state, {} as State);

    expect(state).toEqual(initialState);
  });

  it(`should handle ${ActionTypes.SET_ENTITY}`, () => {
    (store.mutations as any)[ActionTypes.SET_ENTITY](state, {
      email: 'user_email',
      token: 'user_token'
    });
    expect(state.entity.email).toEqual('user_email');
  });
});
