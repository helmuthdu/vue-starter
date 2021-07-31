import { mount, VueWrapper } from '@vue/test-utils';
import AboutRoute from '../about.route.vue';

describe('Route -> About', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(AboutRoute);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
