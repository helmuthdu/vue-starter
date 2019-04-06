import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

const localVue = createLocalVue();

describe('Route -> Home', () => {
  let wrapper: Wrapper<HomeRoute>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute, { localVue });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
