import { mount, VueWrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { State } from '@/modules/user/stores/modules/user/user.store';
import SignInRoute from '../sign-in.route.vue';

describe('Auth/Route -> SignIn', () => {
  let store: Store<State>;
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    store = new Vuex.Store({
      actions: {
        signIn: jest.fn()
      }
    });
    wrapper = mount(SignInRoute, { global: { plugins: [store] } });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
