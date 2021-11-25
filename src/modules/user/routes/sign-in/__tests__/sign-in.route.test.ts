import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia } from 'pinia';
import SignInRoute from '../sign-in.route.vue';

describe('Auth/Route -> SignIn', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(SignInRoute, { global: { plugins: [createPinia()] } });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
