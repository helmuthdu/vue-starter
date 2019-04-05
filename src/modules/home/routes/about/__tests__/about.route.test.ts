import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import AboutRoute from '../about.route.vue';

const localVue = createLocalVue();

localVue.use(Vuetify);

describe('Route -> About', () => {
  let wrapper: Wrapper<AboutRoute>;

  beforeEach(() => {
    wrapper = shallowMount(AboutRoute, { localVue });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
