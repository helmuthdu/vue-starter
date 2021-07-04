import { mount, VueWrapper } from '@vue/test-utils';
import NetworkErrorRoute from '../network-error.route.vue';

describe('Route -> Network Error', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(NetworkErrorRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
