import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import VueRouter from 'vue-router';
import DefaultLayout from '../default.layout.vue';

const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(VueRouter);

describe('Layout -> default', () => {
  let wrapper: Wrapper<DefaultLayout>;

  beforeEach(() => {
    wrapper = shallowMount(DefaultLayout, { localVue, router });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
