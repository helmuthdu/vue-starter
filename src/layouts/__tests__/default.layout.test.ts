import DefaultLayout from '../default.layout.vue';
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuetify);

const router = new VueRouter();

describe('About route component', () => {
  let wrapper: Wrapper<DefaultLayout>;

  beforeEach(() => {
    wrapper = shallowMount(DefaultLayout, { localVue, router });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
