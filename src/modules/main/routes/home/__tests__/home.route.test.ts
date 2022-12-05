import { shallowMount, VueWrapper } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

describe('Route -> Home', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
