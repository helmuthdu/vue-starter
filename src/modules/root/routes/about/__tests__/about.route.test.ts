import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import AboutRoute from '../about.route.vue';

const localVue = createLocalVue();

describe('Route -> About', () => {
  let wrapper: Wrapper<AboutRoute>;

  beforeEach(() => {
    wrapper = shallowMount(AboutRoute, { localVue });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
