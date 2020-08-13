import { mount, VueWrapper } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import DefaultLayout from '../default.layout.vue';

const router = createRouter({ history: createMemoryHistory(), routes: [] });

describe('Layout -> default', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(DefaultLayout, { global: { plugins: [router] } });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
