import { type VueWrapper, mount } from '@vue/test-utils';
import DefaultLayout from '../default.layout.vue';

describe('Layout -> default', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    wrapper = mount(DefaultLayout);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
