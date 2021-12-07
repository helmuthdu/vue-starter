import { mount, VueWrapper } from '@vue/test-utils';
import SignInRoute from '../sign-in.route.vue';

describe('Auth/Route -> SignIn', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(SignInRoute);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
