import HomeRoute from '../home.route.vue';
import { shallowMount, Wrapper } from '@vue/test-utils';

describe('HomeRoute component', () => {
  let wrapper: Wrapper<HomeRoute>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
