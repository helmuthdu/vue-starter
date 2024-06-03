import { type VueWrapper, mount } from '@vue/test-utils';
import UserLayout from '../user.layout.vue';

describe('User/Layout', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    wrapper = mount(UserLayout);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
