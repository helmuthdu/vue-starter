import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import NotFoundRoute from '../not-found.route.vue';

const localVue = createLocalVue();

localVue.use(Vuetify);

describe('Route -> NotFound', () => {
  let wrapper: Wrapper<NotFoundRoute>;

  beforeEach(() => {
    wrapper = shallowMount(NotFoundRoute, { localVue });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
