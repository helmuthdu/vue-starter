import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import DefaultLayout from '../default.layout.vue';

const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(VueRouter);
localVue.use(Vuetify);

describe('Layout -> Default', () => {
  let wrapper: Wrapper<DefaultLayout>;

  beforeEach(() => {
    wrapper = shallowMount(DefaultLayout, { localVue, router });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
