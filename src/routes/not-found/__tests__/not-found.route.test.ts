import { shallowMount, Wrapper } from '@vue/test-utils';
import NotFoundRoute from '../not-found.route.vue';

describe('Route -> NotFound', () => {
  let wrapper: Wrapper<NotFoundRoute>;

  beforeEach(() => {
    wrapper = shallowMount(NotFoundRoute);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
