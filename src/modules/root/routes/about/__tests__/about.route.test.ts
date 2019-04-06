import { shallowMount, Wrapper } from '@vue/test-utils';
import AboutRoute from '../about.route.vue';

describe('Home/Route -> About', () => {
  let wrapper: Wrapper<AboutRoute>;

  beforeEach(() => {
    wrapper = shallowMount(AboutRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
