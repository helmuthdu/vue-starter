import { type VueWrapper, mount } from '@vue/test-utils';
import MainLayout from '../main.layout.vue';

describe('Layout -> Main', () => {
  let wrapper: VueWrapper<unknown>;

  beforeEach(() => {
    wrapper = mount(MainLayout);
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
