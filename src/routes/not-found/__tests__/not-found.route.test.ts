import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import NotFound from '../not-found.route.vue';

const localVue = createLocalVue();

localVue.use(Vuetify);

describe('Route -> NotFound', () => {
  let wrapper: Wrapper<NotFound>;

  beforeEach(() => {
    wrapper = shallowMount(NotFound, { localVue });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
