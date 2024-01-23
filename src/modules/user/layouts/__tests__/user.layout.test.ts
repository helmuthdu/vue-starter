import { mount, VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import UserLayout from '../user.layout.vue';

const router = createRouter({ history: createMemoryHistory(), routes: [] });

describe('User/Layout', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(UserLayout, {
      global: {
        plugins: [router],
        stubs: ['router-view'],
      },
    });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
