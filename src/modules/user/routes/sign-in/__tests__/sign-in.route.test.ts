import { mount, VueWrapper } from '@vue/test-utils';
import { createStore, Store } from 'vuex';
import { initialState } from '@/modules/user/stores/modules/user/user.store';
import SignInRoute from '../sign-in.route.vue';
import { AppState } from '@/stores';

describe('Auth/Route -> SignIn', () => {
  let store: Store<AppState>;
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    store = createStore({
      state: () => ({ user: initialState } as AppState),
      getters: { isLoggedIn: () => true },
      actions: { signIn: jest.fn() }
    });
    wrapper = mount(SignInRoute, { global: { plugins: [store] } });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
