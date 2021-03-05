import { mount, VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import HomeLayout from '../home.layout.vue';

const router = createRouter({ history: createMemoryHistory(), routes: [] });

describe('Layout -> Home', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(HomeLayout, { global: { plugins: [router] } });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
