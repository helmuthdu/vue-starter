import { mount, VueWrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { State, UserActionTypes } from '@/modules/user/stores/modules/user';
import SignInRoute from '../sign-in.route.vue';

describe('Auth/Route -> SignIn', () => {
  let store: Store<State>;
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    store = new Vuex.Store({
      actions: {
        [UserActionTypes.SIGN_IN]: jest.fn()
      }
    });
    wrapper = mount(SignInRoute, { global: { plugins: [store] } });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
