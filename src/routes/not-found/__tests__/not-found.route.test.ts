import { mount, VueWrapper } from '@vue/test-utils';
import NotFoundRoute from '../not-found.route.vue';

describe('Route -> NotFound', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(NotFoundRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
