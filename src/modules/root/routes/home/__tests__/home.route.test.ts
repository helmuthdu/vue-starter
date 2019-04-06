import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import HomeRoute from '../home.route.vue';

const localVue = createLocalVue();

localVue.use(Vuetify);

describe('Route -> Home', () => {
  let wrapper: Wrapper<HomeRoute>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute, { localVue });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
