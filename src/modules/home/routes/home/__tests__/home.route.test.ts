import { type VueWrapper, shallowMount } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

describe('Route -> Home', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
