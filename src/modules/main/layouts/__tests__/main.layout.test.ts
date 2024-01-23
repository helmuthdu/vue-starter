import { mount, VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import MainLayout from '../main.layout.vue';

const router = createRouter({ history: createMemoryHistory(), routes: [] });

describe('Layout -> Main', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(MainLayout, {
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
