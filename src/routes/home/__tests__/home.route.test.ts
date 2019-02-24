import { shallowMount, Wrapper } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

describe('HomeRoute component', () => {
  let wrapper: Wrapper<HomeRoute>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
