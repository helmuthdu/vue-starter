import { type VueWrapper, mount } from '@vue/test-utils';
import NetworkErrorRoute from '../network-error.route.vue';

describe('Route -> Network Error', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    wrapper = mount(NetworkErrorRoute);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
