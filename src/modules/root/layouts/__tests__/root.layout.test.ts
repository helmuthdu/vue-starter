import { mount, VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import RootLayout from '../root.layout.vue';

const router = createRouter({ history: createMemoryHistory(), routes: [] });

describe('Layout -> Root', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(RootLayout, { global: { plugins: [router] } });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
