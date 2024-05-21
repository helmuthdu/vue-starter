import { type VueWrapper, mount } from '@vue/test-utils';
import NotFoundRoute from '../not-found.route.vue';

describe('Route -> NotFound', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    wrapper = mount(NotFoundRoute, { props: { resource: 'test' } });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
