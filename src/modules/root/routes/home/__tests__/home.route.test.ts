import { mount, VueWrapper } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

describe('Route -> Home', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(HomeRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
